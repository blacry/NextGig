import { NextRequest, NextResponse } from "next/server";
import { rankCandidates } from "@/lib/ai";

export async function POST(request: NextRequest) {
  try {
    const { candidates, opportunityTitle } = await request.json();

    if (!candidates || !Array.isArray(candidates)) {
      return NextResponse.json(
        { error: "candidates array is required." },
        { status: 400 }
      );
    }

    const result = await rankCandidates(candidates, opportunityTitle || "Target Role");
    return NextResponse.json(result);
  } catch (error) {
    console.error("[API] rank-explain error:", error);
    return NextResponse.json(
      { error: "Failed to generate candidate explanations. The AI service may be temporarily unavailable." },
      { status: 500 }
    );
  }
}
