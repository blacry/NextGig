import { NextRequest, NextResponse } from "next/server";
import { extractSkillsFromResume } from "@/lib/ai";

async function getGithubContext(url?: string): Promise<string> {
  if (!url) return "";
  try {
    const parsed = new URL(url);
    if (parsed.hostname !== "github.com") return "";
    const parts = parsed.pathname.split("/").filter(Boolean);
    const username = parts[0];
    if (!username) return "";
    const endpoint = parts[1]
      ? `https://api.github.com/repos/${username}/${parts[1]}`
      : `https://api.github.com/users/${username}/repos?per_page=20&sort=updated`;
    const response = await fetch(endpoint, { headers: { Accept: "application/vnd.github+json" }, next: { revalidate: 300 } });
    if (!response.ok) return "";
    const data = await response.json();
    const repos = Array.isArray(data) ? data : [data];
    return JSON.stringify(repos.map((repo) => ({
      name: repo.name,
      description: repo.description,
      language: repo.language,
      topics: repo.topics,
      url: repo.html_url,
    })));
  } catch {
    return "";
  }
}

export async function POST(request: NextRequest) {
  try {
    const { text, sources } = await request.json();

    if (!text || typeof text !== "string" || text.trim().length < 20) {
      return NextResponse.json(
        { error: "Resume text must be at least 20 characters long." },
        { status: 400 }
      );
    }

    const githubContext = await getGithubContext(sources?.githubUrl);
    const result = await extractSkillsFromResume(text, sources, githubContext);
    return NextResponse.json(result);
  } catch (error) {
    console.error("[API] extract-skills error:", error);
    return NextResponse.json(
      { error: "Failed to extract skills. The AI service may be temporarily unavailable." },
      { status: 500 }
    );
  }
}
