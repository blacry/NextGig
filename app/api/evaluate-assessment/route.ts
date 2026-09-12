import { NextRequest, NextResponse } from "next/server";
import { evaluateAssessment } from "@/lib/ai";

export async function POST(request: NextRequest) {
  try {
    const { questions, answers, parsedProfile } = await request.json();

    if (!questions || !answers || !parsedProfile) {
      return NextResponse.json(
        { error: "questions, answers, and parsedProfile are all required." },
        { status: 400 }
      );
    }

    const result = await evaluateAssessment(questions, answers, parsedProfile);
    return NextResponse.json(result);
  } catch (error) {
    console.error("[API] evaluate-assessment error:", error);
    return NextResponse.json(
      { error: "Failed to evaluate assessment. The AI service may be temporarily unavailable." },
      { status: 500 }
    );
  }
}
