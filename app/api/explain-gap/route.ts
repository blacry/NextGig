import { NextRequest, NextResponse } from "next/server";
import { explainGap } from "@/lib/ai";

export async function POST(request: NextRequest) {
  try {
    const { studentSkills, targetSkills, opportunityTitle } = await request.json();

    if (!studentSkills || !targetSkills) {
      return NextResponse.json(
        { error: "studentSkills and targetSkills arrays are required." },
        { status: 400 }
      );
    }

    const result = await explainGap(studentSkills, targetSkills, opportunityTitle || "Target Role");
    return NextResponse.json(result);
  } catch (error) {
    console.error("[API] explain-gap error:", error);
    return NextResponse.json(
      { error: "Failed to explain gaps. The AI service may be temporarily unavailable." },
      { status: 500 }
    );
  }
}
