import { NextResponse } from "next/server";
import OpenAI from "openai";

export const runtime = "nodejs";

function getClient(): OpenAI {
  const apiKey = process.env.AI_API_KEY;
  const baseURL = process.env.AI_BASE_URL;

  if (!apiKey || !baseURL) {
    throw new Error(
      "AI_API_KEY and AI_BASE_URL must be set in .env.local"
    );
  }

  return new OpenAI({ apiKey, baseURL });
}

function getModel(): string {
  return process.env.AI_MODEL || "openai/gpt-oss-120b";
}

interface YouTubeCourse {
  title: string;
  videoId: string;
  thumbnail: string;
  channel: string;
  description: string;
  relevance: number;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { skills, context } = body;

    if (!skills || !Array.isArray(skills) || skills.length === 0) {
      return NextResponse.json(
        { error: "Skills array is required" },
        { status: 400 }
      );
    }

    const client = getClient();
    const model = getModel();

    const prompt = `You are a learning recommendation expert. Given the following skills and context, recommend 6 highly relevant YouTube courses/tutorials.

Skills to learn: ${skills.join(", ")}
Context: ${context || "General skill improvement"}

For each recommendation, provide:
1. A specific, real YouTube video title that would help learn these skills
2. A realistic YouTube video ID (11 characters, alphanumeric and hyphens)
3. The channel name
4. A brief description of what the video covers
5. A relevance score (0-100) for how well it matches the needs

Return ONLY valid JSON in this exact format:
{
  "courses": [
    {
      "title": "Complete React Tutorial for Beginners",
      "videoId": "dQw4w9WgXcQ",
      "channel": "Programming with Mosh",
      "description": "Learn React from scratch with practical examples",
      "relevance": 95
    }
  ]
}`;

    const response = await client.chat.completions.create({
      model,
      messages: [
        {
          role: "system",
          content: "You are a helpful learning advisor who recommends educational YouTube content. Always return valid JSON."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 2048,
    });

    const content = response.choices[0]?.message?.content || "{}";

    // Parse the JSON response
    let cleaned = content.trim();
    cleaned = cleaned
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/\s*```$/i, "")
      .trim();

    const parsed = JSON.parse(cleaned);
    const courses: YouTubeCourse[] = parsed.courses || [];

    // Add thumbnail URLs
    const coursesWithThumbnails = courses.map((course) => ({
      ...course,
      thumbnail: `https://img.youtube.com/vi/${course.videoId}/maxresdefault.jpg`,
    }));

    return NextResponse.json({ courses: coursesWithThumbnails });
  } catch (error) {
    console.error("[youtube-courses] Error:", error);
    return NextResponse.json(
      {
        error: "Failed to generate course recommendations",
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}
