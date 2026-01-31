import { NextResponse } from "next/server";
import { sendContactEmail } from "@/lib/mailer";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    await sendContactEmail({ name, email, message });

    return NextResponse.json({ message: "Message sent successfully" });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Failed to send message" },
      { status: 500 }
    );
  }
}
