import { NextRequest, NextResponse } from "next/server";
import { generateAssessment } from "@/lib/ai";

export async function POST(request: NextRequest) {
  try {
    const { parsedProfile } = await request.json();

    if (!parsedProfile || !parsedProfile.skills || !Array.isArray(parsedProfile.skills)) {
      return NextResponse.json(
        { error: "parsedProfile with skills array is required." },
        { status: 400 }
      );
    }

    const questions = await generateAssessment(parsedProfile);
    return NextResponse.json({ questions });
  } catch (error) {
    console.error("[API] generate-assessment error:", error);
    return NextResponse.json(
      { error: "Failed to generate assessment. The AI service may be temporarily unavailable." },
      { status: 500 }
    );
  }
}
