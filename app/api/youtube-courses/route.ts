import { NextResponse } from "next/server";
import OpenAI from "openai";

const YOUTUBE_OEMBED = "https://www.youtube.com/oembed";
export const runtime = "nodejs";

interface YouTubeCourse { title: string; videoId: string; thumbnail: string; channel: string; description: string; relevance: number; }
const FALLBACKS: Record<string, { title: string; videoId: string; channel: string; description: string }[]> = {
  react: [{ title: "React JS Course for Beginners", videoId: "bMknfKXIFA8", channel: "freeCodeCamp.org", description: "Build modern React interfaces from the fundamentals." }],
  javascript: [{ title: "JavaScript Full Course", videoId: "PkZNo7MFNFg", channel: "freeCodeCamp.org", description: "Learn core JavaScript concepts through practical examples." }],
  python: [{ title: "Python for Beginners", videoId: "rfscVS0vtbw", channel: "freeCodeCamp.org", description: "A complete beginner-friendly Python course." }],
  sql: [{ title: "SQL Tutorial - Full Database Course", videoId: "HXV3zeQKqGY", channel: "freeCodeCamp.org", description: "Learn SQL queries and relational database fundamentals." }],
  typescript: [{ title: "TypeScript Course for Beginners", videoId: "30LWjhZzg50", channel: "freeCodeCamp.org", description: "Add reliable types to JavaScript applications." }],
};
function client(): OpenAI | null { const apiKey = process.env.AI_API_KEY; const baseURL = process.env.AI_BASE_URL; if (!apiKey || !baseURL) return null; return new OpenAI({ apiKey, baseURL }); }
function validId(value: unknown): value is string { return typeof value === "string" && /^[A-Za-z0-9_-]{11}$/.test(value); }
function parseJson(content: string): unknown { const match = content.match(/\{[\s\S]*\}/); if (!match) throw new Error("AI returned no JSON"); return JSON.parse(match[0]); }
async function available(videoId: string): Promise<boolean> { try { const response = await fetch(`${YOUTUBE_OEMBED}?url=${encodeURIComponent(`https://www.youtube.com/watch?v=${videoId}`)}&format=json`, { signal: AbortSignal.timeout(5000), cache: "no-store" }); return response.ok; } catch { return false; } }
async function verify(courses: Omit<YouTubeCourse, "thumbnail">[]): Promise<YouTubeCourse[]> { const results = await Promise.all(courses.slice(0, 12).map(async (course) => ({ course, ok: await available(course.videoId) }))); return results.filter((item) => item.ok).map(({ course }) => ({ ...course, thumbnail: `https://img.youtube.com/vi/${course.videoId}/hqdefault.jpg` })).slice(0, 6); }
export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null); const skills = Array.isArray(body?.skills) ? body.skills.filter((s: unknown): s is string => typeof s === "string" && s.trim().length > 0).slice(0, 10) : [];
    if (!skills.length) return NextResponse.json({ error: "Skills array is required", courses: [] }, { status: 400 });
    const ai = client(); let candidates: Omit<YouTubeCourse, "thumbnail">[] = [];
    if (ai) { try { const response = await ai.chat.completions.create({ model: process.env.AI_MODEL || "openai/gpt-oss-120b", messages: [{ role: "system", content: "Return only valid JSON with a courses array. Never invent URLs; use real public YouTube video IDs." }, { role: "user", content: `Recommend up to 6 current educational YouTube videos for: ${skills.join(", ")}. Include title, videoId, channel, description, relevance (0-100). Context: ${typeof body?.context === "string" ? body.context.slice(0, 500) : "skill improvement"}` }], temperature: 0.3, max_tokens: 1800 }); const parsed = parseJson(response.choices[0]?.message?.content || ""); const raw = Array.isArray((parsed as { courses?: unknown }).courses) ? (parsed as { courses: unknown[] }).courses : []; candidates = raw.flatMap((item) => { if (!item || typeof item !== "object") return []; const value = item as Record<string, unknown>; if (!validId(value.videoId) || typeof value.title !== "string") return []; return [{ title: value.title.slice(0, 160), videoId: value.videoId, channel: typeof value.channel === "string" ? value.channel.slice(0, 100) : "YouTube", description: typeof value.description === "string" ? value.description.slice(0, 300) : "Recommended for your learning path.", relevance: Math.max(0, Math.min(100, Number(value.relevance) || 0)) }]; }); } catch (error) { console.error("[youtube-courses] AI provider failed", error); } }
    const unique = [...new Map(candidates.map((course) => [course.videoId, course])).values()]; let courses = await verify(unique);
    if (!courses.length) { const fallback = Object.entries(FALLBACKS).filter(([key]) => skills.some((skill: string) => skill.toLowerCase().includes(key))).flatMap(([, values]) => values.map((value) => ({ ...value, relevance: 88 }))); courses = await verify([...new Map(fallback.map((course) => [course.videoId, course])).values()]); }
    return NextResponse.json({ courses, warning: courses.length ? undefined : "No verified recommendations are available right now. Try again shortly." });
  } catch (error) { console.error("[youtube-courses] request failed", error); return NextResponse.json({ error: "Recommendations are temporarily unavailable. Please retry.", courses: [] }, { status: 503 }); }
}
