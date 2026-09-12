import OpenAI from "openai";
import type {
  Skill,
  Student,
  AssessmentQuestion,
  AssessmentAnswer,
  AssessmentResult,
  SkillLevel,
  ChatMessage,
} from "./types";


function getClient(): OpenAI {
  const apiKey = process.env.AI_API_KEY;
  const baseURL = process.env.AI_BASE_URL;

  if (!apiKey || !baseURL) {
    throw new Error(
      "AI_API_KEY and AI_BASE_URL must be set in .env.local. " +
      "See .env.local.example for configuration."
    );
  }

  return new OpenAI({ apiKey, baseURL });
}

function getModel(): string {
  return process.env.AI_MODEL || "openai/gpt-oss-120b";
}

interface ChatCompleteOptions {
  temperature?: number;
  maxTokens?: number;
}

async function chatComplete(
  messages: OpenAI.Chat.ChatCompletionMessageParam[],
  options: ChatCompleteOptions = {}
): Promise<string> {
  const client = getClient();
  const model = getModel();

  const response = await client.chat.completions.create({
    model,
    messages,
    temperature: options.temperature ?? 0.3,
    max_tokens: options.maxTokens ?? 4096,
  });

  return response.choices[0]?.message?.content || "";
}


function parseJSON<T>(raw: string, fallback: T): T {
  try {
  
    let cleaned = raw.trim();
    if (cleaned.startsWith("```json")) {
      cleaned = cleaned.slice(7);
    } else if (cleaned.startsWith("```")) {
      cleaned = cleaned.slice(3);
    }
    if (cleaned.endsWith("```")) {
      cleaned = cleaned.slice(0, -3);
    }
    cleaned = cleaned.trim();

    const parsed: unknown = JSON.parse(cleaned);
    // Some compatible AI endpoints serialize the JSON object as a JSON string.
    return (typeof parsed === "string" ? JSON.parse(parsed) : parsed) as T;
  } catch {
    console.error("[AI] Failed to parse JSON response:", raw.slice(0, 200));
    return fallback;
  }
}

export async function extractSkillsFromResume(text: string, sources?: { githubUrl?: string; linkedinUrl?: string }, githubContext = ""): Promise<{
  name: string;
  email: string;
  bio: string;
  education: { degree: string; field: string; institution: string; year: number; gpa?: number };
  skills: { id: string; name: string; domain: string; level: number }[];
  projects: { title: string; description: string; techStack: string[] }[];
  certifications: { name: string; issuer: string; date: string }[];
}> {
  const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
    {
      role: "system",
      content: `You are a resume parser for a skill intelligence platform. Extract structured information from the given resume text. Return ONLY valid JSON with no additional text.

The JSON must have this exact structure:
{
  "name": "Full Name",
  "email": "email@example.com",
  "bio": "1-2 sentence professional summary",
  "education": {
    "degree": "B.Tech/M.Tech/etc",
    "field": "Computer Science/Data Science/etc",
    "institution": "University Name",
    "year": 2026,
    "gpa": 8.5
  },
  "skills": [
    { "id": "skill-id-lowercase-kebab", "name": "Skill Name", "domain": "frontend|backend|data-ai|cloud|devops|mobile|general", "level": 1-5 }
  ],
  "projects": [
    { "title": "Project Name", "description": "Brief description", "techStack": ["Tech1", "Tech2"] }
  ],
  "certifications": [
    { "name": "Cert Name", "issuer": "Issuer", "date": "YYYY-MM-DD" }
  ]
}

Skill levels: 1=Beginner, 2=Elementary, 3=Intermediate, 4=Advanced, 5=Expert.
Infer skill levels from context (years of experience, project complexity, certifications).
Use lowercase-kebab-case for skill IDs (e.g., "machine-learning", "react-native").
Valid domains: frontend, backend, data-ai, cloud, devops, mobile, general.`,
    },
    {
      role: "user",
      content: `Parse this resume and extract structured information. Use the supplied GitHub metadata as additional evidence, but never invent details that are not present in the resume or metadata. LinkedIn is a reference link only and must not be treated as verified content.\n\nSource links: ${JSON.stringify(sources || {})}\nGitHub metadata: ${githubContext || "Unavailable"}\n\n${text}`,
    },
  ];

  const raw = await chatComplete(messages, { temperature: 0.1 });

  return parseJSON(raw, {
    name: "Unknown",
    email: "",
    bio: "",
    education: { degree: "", field: "", institution: "", year: 2026 },
    skills: [],
    projects: [],
    certifications: [],
  });
}

/**
 * Generate a personalized skill assessment based on the student's parsed profile.
 * Questions are easy/medium/hard based on claimed skill levels.
 * Mix of objective (multiple choice) and subjective (written) questions.
 */
export async function generateAssessment(parsedProfile: {
  skills: { name: string; level: number; id: string }[];
  projects?: { title: string; techStack: string[] }[];
  certifications?: { name: string; issuer?: string }[];
}): Promise<AssessmentQuestion[]> {
  const skillsToAssess = parsedProfile.skills;

  const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
    {
      role: "system",
      content: `You are a skill assessment generator for a placement platform. Generate a personalized assessment based on the student's claimed skills. Return ONLY valid JSON.

Rules:
- Generate 1-3 questions per skill as needed to cover the profile (do not cap the number of skills).
- Balance difficulty across the full assessment: mostly easy for levels 1-2, medium for level 3, and hard for levels 4-5, with a smaller adjacent-difficulty mix when useful.
- Mix objective (multiple choice with 4 options) and subjective (short answer) questions
- Objective questions: exactly 4 options, one correct answer
- Subjective questions: expect 2-4 sentence answers
- Questions should test practical understanding, not just theory
- Use projects and certifications as evidence when writing contextual questions.

Return JSON array:
[
  {
    "id": "q1",
    "skillId": "skill-id",
    "skillName": "Skill Name",
    "type": "objective" | "subjective",
    "difficulty": "easy" | "medium" | "hard",
    "question": "Question text?",
    "options": ["A", "B", "C", "D"],
    "correctAnswer": "A"
  }
]

For subjective questions, omit "options" and "correctAnswer".`,
    },
    {
      role: "user",
      content: `Generate an assessment for this student profile:

Skills: ${JSON.stringify(skillsToAssess)}
Projects: ${JSON.stringify(parsedProfile.projects || [])}
Certifications: ${JSON.stringify(parsedProfile.certifications || [])}`,
    },
  ];

  const raw = await chatComplete(messages, { temperature: 0.4, maxTokens: 6000 });

  return parseJSON<AssessmentQuestion[]>(raw, []);
}

/**
 * Evaluate a student's assessment answers and return grades per skill.
 * The AI grades both objective and subjective answers.
 */
export async function evaluateAssessment(
  questions: AssessmentQuestion[],
  answers: AssessmentAnswer[],
  parsedProfile: { skills: { name: string; level: number; id: string }[]; projects?: unknown[]; certifications?: unknown[] }
): Promise<AssessmentResult> {
  const questionsWithAnswers = questions.map((q) => {
    const answer = answers.find((a) => a.questionId === q.id);
    return { ...q, studentAnswer: answer?.answer || "No answer provided" };
  });

  const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
    {
      role: "system",
      content: `You are a skill assessment evaluator for a placement platform. Evaluate the student's answers and provide grades. Return ONLY valid JSON.

For objective questions: check if the answer matches the correct answer.
For subjective questions: evaluate depth, accuracy, and practical understanding.

Skill levels: 1=Beginner, 2=Elementary, 3=Intermediate, 4=Advanced, 5=Expert.

Return JSON:
{
  "overallScore": 0-100,
  "overallGrade": "A+/A/B+/B/C+/C/D/F",
  "skillGrades": [
    {
      "skillId": "skill-id",
      "skillName": "Skill Name",
      "claimedLevel": 1-5,
      "assessedLevel": 1-5,
      "score": 0-100,
      "feedback": "Specific feedback about their performance in this skill"
    }
  ],
  "recommendations": [
    "Course/learning recommendation 1",
    "Course/learning recommendation 2"
  ],
  "cvTips": [
    "CV improvement tip 1",
    "CV improvement tip 2"
  ]
}

Be fair but honest. If claimed level 4 but answers suggest level 2, say so.
Make every recommendation and CV tip specific to the student's projects, certifications, assessed gaps, and target skill level. Mention the exact project or credential when it is relevant. Never give generic praise or generic advice.`,
    },
    {
      role: "user",
      content: `Evaluate these assessment answers:

Questions & Answers: ${JSON.stringify(questionsWithAnswers)}

Student profile context: ${JSON.stringify(parsedProfile)}`,
    },
  ];

  const raw = await chatComplete(messages, { temperature: 0.2, maxTokens: 8000 });

  const fallback: AssessmentResult = {
    overallScore: 50,
    overallGrade: "C",
    skillGrades: parsedProfile.skills.map((s) => ({
      skillId: s.id,
      skillName: s.name,
      claimedLevel: s.level as SkillLevel,
      assessedLevel: Math.max(1, s.level - 1) as SkillLevel,
      score: 50,
      feedback: "Assessment could not be fully evaluated. Please try again.",
    })),
    recommendations: [
      ...parsedProfile.skills.slice(0, 4).map((skill) =>
        `Build one practical ${skill.name} project at level ${Math.min(5, skill.level + 1)} difficulty and document the decisions you made.`
      ),
      "Retake the assessment after practicing the skills with the lowest scores.",
    ],
    cvTips: [
      ...((parsedProfile.projects || []).slice(0, 3).map((project) => {
        const title = typeof project === "object" && project !== null && "title" in project ? String(project.title) : "your project";
        return `Add measurable outcomes, your specific contribution, and the technologies used to ${title}.`;
      })),
      ...((parsedProfile.certifications || []).slice(0, 2).map((certification) => {
        const name = typeof certification === "object" && certification !== null && "name" in certification ? String(certification.name) : "each certification";
        return `Place ${name} near your skills and connect it to a project or assessed capability.`;
      })),
      "Replace broad claims with evidence: scale, performance change, users, or time saved.",
    ],
  };
  const result = parseJSON<AssessmentResult>(raw, fallback);

  // Keep the results useful even when an AI provider returns a valid but
  // incomplete response.
  return {
    ...fallback,
    ...result,
    skillGrades: Array.isArray(result.skillGrades) && result.skillGrades.length > 0 ? result.skillGrades : fallback.skillGrades,
    recommendations: Array.isArray(result.recommendations) && result.recommendations.length >= 3
      ? result.recommendations
      : [...(Array.isArray(result.recommendations) ? result.recommendations : []), ...fallback.recommendations].slice(0, 5),
    cvTips: Array.isArray(result.cvTips) && result.cvTips.length >= 3
      ? result.cvTips
      : [...(Array.isArray(result.cvTips) ? result.cvTips : []), ...fallback.cvTips].slice(0, 5),
  };
}

/**
 * Explain skill gaps between a student's skills and target requirements.
 * Returns AI-generated explanations grounded in the actual skill lists.
 */
export async function explainGap(
  studentSkills: { name: string; level: number; verification: string }[],
  targetSkills: { name: string; requiredLevel: number; preferred: boolean }[],
  opportunityTitle: string
): Promise<{ gaps: { skillName: string; explanation: string; actionItems: string[] }[] }> {
  const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
    {
      role: "system",
      content: `You are a career advisor for a placement platform. Analyze skill gaps between a student's current skills and an opportunity's requirements. Return ONLY valid JSON.

For each gap, provide:
1. A clear explanation of WHY this gap matters for the role
2. Specific action items to close the gap (courses, projects, certifications)

Return JSON:
{
  "gaps": [
    {
      "skillName": "Skill Name",
      "explanation": "Why this gap matters for the role and how it affects candidacy",
      "actionItems": ["Specific action 1", "Specific action 2"]
    }
  ]
}

Be specific and actionable. Reference the actual role when explaining importance.`,
    },
    {
      role: "user",
      content: `Analyze skill gaps for the "${opportunityTitle}" role:

Student's skills: ${JSON.stringify(studentSkills)}
Required/preferred skills: ${JSON.stringify(targetSkills)}`,
    },
  ];

  const raw = await chatComplete(messages, { temperature: 0.3 });

  return parseJSON(raw, { gaps: [] });
}

/**
 * Generate one-line "why this candidate" explanations for ranked candidates.
 * Used in the recruiter talent view — pairs with the deterministic score.
 */
export async function rankCandidates(
  candidates: { name: string; score: number; metSkills: string[]; gapSkills: string[] }[],
  opportunityTitle: string
): Promise<{ explanations: { name: string; explanation: string }[] }> {
  const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
    {
      role: "system",
      content: `You are a recruitment advisor. For each candidate, write a concise one-line explanation of why they are a good (or not ideal) fit for the role. Return ONLY valid JSON.

Focus on their strongest matching skills and most critical gaps.
Be specific — mention actual skill names.

Return JSON:
{
  "explanations": [
    { "name": "Candidate Name", "explanation": "One-line explanation" }
  ]
}`,
    },
    {
      role: "user",
      content: `Write candidate explanations for the "${opportunityTitle}" role:

Candidates: ${JSON.stringify(candidates)}`,
    },
  ];

  const raw = await chatComplete(messages, { temperature: 0.4 });

  return parseJSON(raw, {
    explanations: candidates.map((c) => ({
      name: c.name,
      explanation: `Match score: ${c.score}%. Meets ${c.metSkills.length} skills, gaps in ${c.gapSkills.length} areas.`,
    })),
  });
}

/**
 * AI Assistant — grounded in the student's own data.
 * NOT an open-ended chatbot. Only answers questions about the student's
 * profile, skills, gaps, opportunities, and career advice.
 */
export async function askAssistant(
  message: string,
  context: {
    studentName: string;
    skills: Skill[];
    education: Student["education"];
    gaps?: { skillName: string; severity: string }[];
    topOpportunities?: { title: string; company: string; matchScore: number }[];
  },
  history: ChatMessage[] = []
): Promise<{ response: string }> {
  const historyMessages: OpenAI.Chat.ChatCompletionMessageParam[] = history
    .slice(-10) // Keep last 10 messages for context
    .map((msg) => ({
      role: msg.role as "user" | "assistant",
      content: msg.content,
    }));

  const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
    {
      role: "system",
      content: `You are NextGig AI Assistant, a career advisor for ${context.studentName}. You help with placement preparation, skill development, and career guidance.

IMPORTANT RULES:
- Only answer questions related to the student's career, skills, placement, and the data provided below.
- Do NOT answer general knowledge questions unrelated to career/placement.
- Be specific and actionable in your advice.
- Reference the student's actual skills and gaps when giving advice.
- Keep responses concise (2-4 paragraphs max).

STUDENT PROFILE:
Name: ${context.studentName}
Education: ${context.education.degree} in ${context.education.field} from ${context.education.institution} (${context.education.year})
Skills: ${context.skills.map((s) => `${s.name} (Level ${s.level}, ${s.verification})`).join(", ")}
${context.gaps ? `Skill Gaps: ${context.gaps.map((g) => `${g.skillName} (${g.severity})`).join(", ")}` : ""}
${context.topOpportunities ? `Top Opportunities: ${context.topOpportunities.map((o) => `${o.title} at ${o.company} (${o.matchScore}% match)`).join(", ")}` : ""}`,
    },
    ...historyMessages,
    {
      role: "user",
      content: message,
    },
  ];

  const raw = await chatComplete(messages, { temperature: 0.5, maxTokens: 1500 });

  return { response: raw || "I'm sorry, I couldn't generate a response. Please try again." };
}
