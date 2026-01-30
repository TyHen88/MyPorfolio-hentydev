import { NextRequest, NextResponse } from 'next/server'

// Force dynamic rendering
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

// Dynamic imports to avoid module loading errors at build time
async function getPortfolioData() {
    try {
        const module = await import('@/lib/portfolio-data')
        return module.portfolioData
    } catch (e) {
        console.error('Failed to load portfolio data:', e)
        return null
    }
}

async function getAiPrompts() {
    try {
        const module = await import('@/lib/ai-prompts')
        return module.aiPrompts
    } catch (e) {
        console.error('Failed to load AI prompts:', e)
        return 'You are a helpful AI assistant.'
    }
}

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GOOGLE_API_KEY}`
const AI_DISABLED = process.env.AI_DISABLED === 'true' || process.env.DISABLE_AI === 'true'

interface ChatMessage {
    role: 'user' | 'assistant'
    content: string
}

export async function GET() {
    try {
        // Test if imports are working
        const portfolioData = await getPortfolioData()
        const aiPrompts = await getAiPrompts()
        const hasPortfolioData = portfolioData && Array.isArray(portfolioData) && portfolioData.length > 0
        const hasPrompts = !!aiPrompts

        return NextResponse.json({
            message: 'Chat API is working',
            status: 'ok',
            checks: {
                portfolioData: hasPortfolioData,
                prompts: hasPrompts,
                apiKey: !!GOOGLE_API_KEY,
                aiDisabled: AI_DISABLED
            }
        })
    } catch (error) {
        console.error('GET endpoint error:', error)
        return NextResponse.json({
            error: 'GET endpoint error',
            details: error instanceof Error ? error.message : 'Unknown error',
            stack: error instanceof Error ? error.stack : undefined
        }, { status: 500 })
    }
}

export async function POST(request: NextRequest) {
    try {
        let body
        try {
            body = await request.json()
        } catch (parseError) {
            console.error('Failed to parse request body:', parseError)
            return NextResponse.json(
                { error: 'Invalid JSON in request body' },
                { status: 400 }
            )
        }

        const { message, history = [], sessionId, images } = body

        if (!message) {
            return NextResponse.json(
                { error: 'Message is required' },
                { status: 400 }
            )
        }

        if (AI_DISABLED) {
            return NextResponse.json(
                { error: 'AI assistant is temporarily disabled' },
                { status: 503 }
            )
        }

        // Load portfolio data and prompts
        const portfolioData = await getPortfolioData()
        const aiPrompts = await getAiPrompts()

        // Check if portfolio data exists
        if (!portfolioData || !Array.isArray(portfolioData) || portfolioData.length === 0) {
            console.error('Portfolio data is missing or invalid')
            return NextResponse.json(
                { error: 'Portfolio data not available' },
                { status: 500 }
            )
        }

        // Build the system prompt with portfolio data
        // Limit the portfolio data size to avoid token limits
        let portfolioSummary
        let systemPrompt

        try {
            portfolioSummary = {
                sections: portfolioData[0].sections?.map((section: any) => ({
                    section_id: section.section_id,
                    content: {
                        headers: section.content?.headers || [],
                        paragraphs: section.content?.paragraphs?.slice(0, 5) || [], // Limit paragraphs
                        links: section.content?.links || [],
                    }
                })) || [],
                routes: portfolioData[0].routes || []
            }

            const portfolioDataStr = JSON.stringify(portfolioSummary, null, 2)

            // Limit total prompt size to avoid token limits (roughly 30k characters)
            const maxPromptLength = 30000
            const basePrompt = `${aiPrompts}\n\n## Portfolio Data (JSON):\n`
            const footer = `\n\nUse the above portfolio data to answer user questions. Always extract information from the provided JSON structure and never fabricate information not present in the data.`
            const availableLength = maxPromptLength - basePrompt.length - footer.length

            const truncatedData = portfolioDataStr.length > availableLength
                ? portfolioDataStr.substring(0, availableLength) + '... (truncated)'
                : portfolioDataStr

            systemPrompt = basePrompt + truncatedData + footer
        } catch (dataError) {
            console.error('Error processing portfolio data:', dataError)
            return NextResponse.json(
                { error: 'Failed to process portfolio data', details: dataError instanceof Error ? dataError.message : 'Unknown error' },
                { status: 500 }
            )
        }

        // Convert history to Gemini format
        const conversationHistory = history
            .filter((msg: ChatMessage) => msg.role && msg.content)
            .map((msg: ChatMessage) => ({
                role: msg.role === 'user' ? 'user' : 'model',
                parts: [{ text: msg.content }]
            }))

        // Build the request payload for Gemini
        // Gemini needs alternating user/model messages
        // Combine system prompt with current message, then add conversation history
        const userMessage = conversationHistory.length > 0
            ? message  // If there's history, just send the current message
            : `${systemPrompt}\n\nUser question: ${message}`  // First message includes system prompt

        const contents: any[] = []

        // Add conversation history first if it exists
        if (conversationHistory.length > 0) {
            // Add system prompt as first message if we have history
            contents.push({
                role: 'user',
                parts: [{ text: systemPrompt }]
            })
            contents.push({
                role: 'model',
                parts: [{ text: 'I understand. I\'ll help you find information from the portfolio data.' }]
            })
            // Add existing conversation history
            contents.push(...conversationHistory)
        }

        // Add current user message
        contents.push({
            role: 'user',
            parts: [
                {
                    text: userMessage
                }
            ]
        })

        // Call Gemini API
        const response = await fetch(GEMINI_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents,
                generationConfig: {
                    temperature: 0.7,
                    topK: 40,
                    topP: 0.95,
                    maxOutputTokens: 2048,
                },
            }),
        })

        if (!response.ok) {
            const errorData = await response.text()
            console.error('Gemini API error:', errorData)
            return NextResponse.json(
                { error: 'Failed to get response from AI', details: errorData },
                { status: response.status }
            )
        }

        const data = await response.json()

        // Extract the response text from Gemini
        const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text ||
            "I'm sorry, I couldn't generate a response. Please try again."

        return NextResponse.json({
            message: aiResponse,
            sessionId: sessionId || `session-${Date.now()}`,
        })
    } catch (error) {
        console.error('Chat API error:', error)
        const errorMessage = error instanceof Error ? error.message : 'Unknown error'
        const errorStack = error instanceof Error ? error.stack : undefined

        // Log full error details for debugging
        console.error('Error details:', {
            message: errorMessage,
            stack: errorStack,
            type: typeof error
        })

        return NextResponse.json(
            {
                error: 'Internal server error',
                details: errorMessage,
                ...(process.env.NODE_ENV === 'development' && { stack: errorStack })
            },
            { status: 500 }
        )
    }
}

