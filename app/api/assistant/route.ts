import { NextRequest, NextResponse } from "next/server";
import { askAssistant } from "@/lib/ai";

export async function POST(request: NextRequest) {
  try {
    const { message, context, history } = await request.json();

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: "message string is required." },
        { status: 400 }
      );
    }

    if (!context) {
      return NextResponse.json(
        { error: "context object with student data is required." },
        { status: 400 }
      );
    }

    const result = await askAssistant(message, context, history || []);
    return NextResponse.json(result);
  } catch (error) {
    console.error("[API] assistant error:", error);
    return NextResponse.json(
      { error: "Failed to get AI response. The AI service may be temporarily unavailable." },
      { status: 500 }
    );
  }
}
