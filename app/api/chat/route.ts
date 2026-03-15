import OpenAI from "openai";
import { NextRequest, NextResponse } from "next/server";

import {
  buildPortfolioKnowledgeBase,
  buildPortfolioKnowledgeBaseString,
} from "@/lib/ai-context";
import { aiPrompts } from "@/lib/ai-prompts";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const OPENAI_MODEL = process.env.OPENAI_MODEL || "gpt-5-mini";
const AI_DISABLED =
  process.env.AI_DISABLED === "true" || process.env.DISABLE_AI === "true";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

type KnowledgeBase = ReturnType<typeof buildPortfolioKnowledgeBase>;

function getOpenAIClient() {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY is not configured.");
  }

  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
}

function formatConversationHistory(history: ChatMessage[]) {
  const trimmedHistory = history
    .filter((message) => message.role && message.content?.trim())
    .slice(-12);

  if (trimmedHistory.length === 0) {
    return "No previous conversation.";
  }

  return trimmedHistory
    .map(
      (message) =>
        `${message.role === "assistant" ? "Assistant" : "User"}: ${message.content.trim()}`,
    )
    .join("\n\n");
}

function buildUserInput(
  message: string,
  history: ChatMessage[],
  knowledgeBaseString: string,
) {
  const conversationHistory = formatConversationHistory(history);

  return [
    "Portfolio knowledge base:",
    knowledgeBaseString,
    "",
    "Conversation history:",
    conversationHistory,
    "",
    "Current user message:",
    message.trim(),
  ].join("\n");
}

function pickReferences(message: string, knowledgeBase: KnowledgeBase) {
  const query = message.toLowerCase();
  const refs = knowledgeBase.references || [];
  const picks = new Map<string, { label: string; url: string }>();

  const addIfPresent = (matcher: (ref: (typeof refs)[number]) => boolean) => {
    const ref = refs.find((item) => item.url && matcher(item));

    if (ref) {
      picks.set(ref.url, { label: ref.label, url: ref.url });
    }
  };

  if (query.includes("experience") || query.includes("work")) {
    addIfPresent((ref) => ref.label.toLowerCase().includes("experience"));
  }

  if (query.includes("skill") || query.includes("tech")) {
    addIfPresent((ref) => ref.label.toLowerCase().includes("skills"));
  }

  if (query.includes("project")) {
    addIfPresent((ref) => ref.label.toLowerCase().includes("projects"));
  }

  if (
    query.includes("blog") ||
    query.includes("article") ||
    query.includes("write")
  ) {
    addIfPresent((ref) => ref.type === "route" && ref.url.includes("/blog"));
  }

  if (query.includes("research") || query.includes("learn")) {
    addIfPresent((ref) => ref.label.toLowerCase().includes("research"));
  }

  if (
    query.includes("best practice") ||
    query.includes("performance") ||
    query.includes("security") ||
    query.includes("accessibility")
  ) {
    addIfPresent((ref) => ref.label.toLowerCase().includes("best practices"));
  }

  if (query.includes("contact") || query.includes("reach")) {
    addIfPresent((ref) => ref.label.toLowerCase().includes("contact"));
  }

  if (query.includes("admin")) {
    addIfPresent((ref) => ref.label.toLowerCase().includes("admin contents"));
  }

  if (query.includes("api") || query.includes("endpoint")) {
    addIfPresent((ref) => ref.label.toLowerCase().includes("ai chat api"));
    addIfPresent((ref) => ref.label.toLowerCase().includes("contact api"));
    addIfPresent((ref) =>
      ref.label.toLowerCase().includes("content sheet api"),
    );
  }

  knowledgeBase.blogPosts.forEach((post) => {
    if (
      query.includes(post.slug.toLowerCase()) ||
      query.includes(post.title.toLowerCase())
    ) {
      picks.set(post.url, { label: post.title, url: post.url });
    }
  });

  if (picks.size === 0) {
    addIfPresent((ref) => ref.label.toLowerCase().includes("about"));
    addIfPresent((ref) => ref.label.toLowerCase().includes("projects"));
  }

  if (picks.size === 0 && knowledgeBase.site.baseUrl) {
    picks.set(knowledgeBase.site.baseUrl, {
      label: "Portfolio home",
      url: knowledgeBase.site.baseUrl,
    });
  }

  return Array.from(picks.values()).slice(0, 3);
}

function ensureReferenceBlock(
  responseText: string,
  message: string,
  knowledgeBase: KnowledgeBase,
) {
  const hasLink = /\[[^\]]+\]\(([^)]+)\)/.test(responseText);
  const hasReferenceBlock =
    responseText.includes("### References") || /^>\s+/m.test(responseText);

  if (hasLink && hasReferenceBlock) {
    return responseText;
  }

  const references = pickReferences(message, knowledgeBase);

  if (references.length === 0) {
    return responseText;
  }

  const referenceBlock = [
    "### References",
    ...references.map((ref) => `> [${ref.label}](${ref.url})`),
  ].join("\n");

  return `${responseText.trim()}\n\n${referenceBlock}`;
}

export async function GET() {
  try {
    const knowledgeBase = buildPortfolioKnowledgeBase();

    return NextResponse.json({
      message: "Chat API is working",
      status: "ok",
      provider: "openai",
      checks: {
        prompts: !!aiPrompts,
        knowledgeBase:
          knowledgeBase.sections.length > 0 ||
          knowledgeBase.blogPosts.length > 0,
        apiKey: !!process.env.OPENAI_API_KEY,
        aiDisabled: AI_DISABLED,
        model: OPENAI_MODEL,
      },
    });
  } catch (error) {
    console.error("GET endpoint error:", error);

    return NextResponse.json(
      {
        error: "GET endpoint error",
        details: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    if (AI_DISABLED) {
      return NextResponse.json(
        { error: "AI assistant is currently disabled." },
        { status: 503 },
      );
    }

    let body;

    try {
      body = await request.json();
    } catch (parseError) {
      console.error("Failed to parse request body:", parseError);

      return NextResponse.json(
        { error: "Invalid JSON in request body" },
        { status: 400 },
      );
    }

    const { message, history = [], sessionId } = body;
    const normalizedMessage = String(message || "").trim();

    if (!normalizedMessage) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 },
      );
    }

    const knowledgeBase = buildPortfolioKnowledgeBase();
    const knowledgeBaseString = buildPortfolioKnowledgeBaseString();
    const client = getOpenAIClient();
    const response = await client.responses.create({
      model: OPENAI_MODEL,
      instructions: aiPrompts,
      input: buildUserInput(
        normalizedMessage,
        history as ChatMessage[],
        knowledgeBaseString,
      ),
    });

    const aiResponse = response.output_text?.trim();

    if (!aiResponse) {
      return NextResponse.json(
        { error: "OpenAI returned an empty response." },
        { status: 502 },
      );
    }

    return NextResponse.json({
      message: ensureReferenceBlock(
        aiResponse,
        normalizedMessage,
        knowledgeBase,
      ),
      sessionId: sessionId || `session-${Date.now()}`,
    });
  } catch (error) {
    console.error("Chat API error:", error);

    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
