import { NextRequest, NextResponse } from "next/server";
import { extractSkillsFromResume } from "@/lib/ai";

export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json();

    if (!text || typeof text !== "string" || text.trim().length < 20) {
      return NextResponse.json(
        { error: "Resume text must be at least 20 characters long." },
        { status: 400 }
      );
    }

    const result = await extractSkillsFromResume(text);
    return NextResponse.json(result);
  } catch (error) {
    console.error("[API] extract-skills error:", error);
    return NextResponse.json(
      { error: "Failed to extract skills. The AI service may be temporarily unavailable." },
      { status: 500 }
    );
  }
}
