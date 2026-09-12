Build a complete, modern frontend for an academia-industry skill intelligence platform called "NextGig" in the working directory. This is an SIH 2026 hackathon MVP (PS 26044) frontend-only pass — no real backend/auth yet (a service called Insforge will be wired in later), so use mock data and a dummy login. Prioritize a working, demo-able slice over full feature coverage.

STACK: Next.js (latest stable, App Router) + TypeScript (.tsx) + React, scaffolded with `npx create-next-app` (npm). use Shadcn, framer motion and Tailwind — implement the design system as a single well-organized global stylesheet (`app/globals.css`) with CSS variables, responsive rules and animations. Split component styles into CSS modules only if clearly cleaner. Server components by default; add "use client" only where interactivity requires it. also impliment a beautiful light and dark mode aswell. u can download and use nessasary skills u may like to use that u think might help you make the project much faster and soomther and will give a better output in the end.

AI: Groq (for now but should be flexable that dev is able to change api keys and models directly from the env file if possible), called from Next.js API routes (never from the client directly — keep the API key server-side). Build `lib/ai.ts` as a single thin wrapper around an OpenAI-compatible chat-completions call, reading ALL of the following from `.env.local` so the provider/model can be swapped without touching code:
```
AI_API_KEY= ....
AI_BASE_URL=https://api.groq.com/openai/v1
AI_MODEL=<a current Groq model id>
```
`lib/ai.ts` exports typed functions (`extractSkillsFromResume(text)`, `explainGap(studentSkills, targetSkills)`, `rankCandidates(candidates, opportunity)`, `askAssistant(message, context)`) — each builds its own prompt, calls the shared `chatComplete()` helper, and parses a JSON response (ask the model to return JSON only, and defensively parse with a try/catch + fallback). Document `lib/ai.ts` in the README as THE provider-swap seam — switching to any other OpenAI-compatible endpoint should only require editing `.env.local`.

SCOPE FOR THIS BUILD: Student role and Recruiter role only. No Institution/Faculty/Admin screens.

AUTH (dummy, frontend-only): `/login` is a simple role picker — "Continue as Student" / "Continue as Recruiter" buttons, no credentials. Selecting one sets the role in a React Context (persisted to localStorage so a refresh doesn't kick the user back to `/login`) and redirects to that role's dashboard. Style it like a real auth screen even though there's no real check — this gets swapped for Insforge later.

PAGES (App Router routes):
1. `/login` — role picker as described above.
2. `/student/${student_name}/dashboard` — Placement readiness ring (%, trend delta), top skill-gap card (current % vs target %), best-match opportunity card (match % + which skills are satisfied), recommended-learning strip. Lead with status, minimize distance to action.
3. `/student/${student_name}/skills` — Skill list with verification-source badges (Self-Declared / Assessed / Project-Verified / Industry-Verified), a skill-meter component (current vs required level), and a resume upload flow: paste resume text (or upload .txt/.pdf — text-extraction only, no OCR needed) → calls `/api/extract-skills` (Groq) → shows extracted skills → user must explicitly confirm before they're added to the mock profile state. Never auto-publish extracted data.
4. `/student/${student_name}/skill-gap` — Gap analysis vs a selected target opportunity: gaps classified critical/moderate/emerging, each with the specific requirement driving it (call `/api/explain-gap`, Groq-generated explanation grounded in the actual skill lists you pass it).
5. `/student/${student_name}/opportunities` and `/student/opportunities/[id]` — Listing page (filter by skill/domain, sort) and detail page: company, role, match score, required/preferred skills, "why you match" breakdown (skill / education / experience / verification components — computed by `lib/matching.ts`, a deterministic rule-based scorer, NOT by the AI), missing skills + suggested action, Apply button (just updates local mock state). Decision-making info stays above the fold.
6. `/student/${student_name}/passport` — Skill Passport: skills, assessments, projects, certifications, industry feedback, visually distinguishing self-claims from assessed/verified evidence.
7. `/student/${student_name}/ai` — AI Assistant chat UI. Calls `/api/assistant`, grounded only in the current mock student's own profile/gap/opportunity data (pass that context in the prompt) — not an open-ended general chatbot.
8. `/recruiter/${recruiter_name}/dashboard` — Dark analytics shell: active opportunities, applications, shortlisted candidates, interviews, selections, key metrics up top.
9. `/recruiter/${recruiter_name}/opportunities` + a create-opportunity form — required/preferred skills (multi-select against the shared skill taxonomy), eligibility, location, duration, compensation, deadline. New opportunities are added to local mock state.
10. `/recruiter/${recruiter_name}/talent` — Candidate list ranked by `lib/matching.ts` against a selected opportunity, with an AI-generated one-line "why this candidate" per row (call `/api/rank-explain`, Groq) — never a bare score, always paired with the breakdown. Dense data table, dark surface.
11. `/recruiter/${recruiter_name}/applications/[id]` — Application lifecycle timeline: Applied → Under Review → Shortlisted → Interview → Selected → Completed, with buttons to advance the mock application's stage.

SHARED COMPONENTS (`components/`):
- Two layout shells sharing the same nav primitive: light/spacious for `(student)` routes, dark/dense for `(recruiter)` routes — same component grammar, different density/theme via a `data-theme` attribute, never two separate visual systems.
- `MatchScore` — always renders the % next to its reasoning breakdown, never alone.
- `SkillMeter` — current-level bar + target-level marker.
- `VerificationBadge` — Self-Declared / Assessed / Project-Verified / Industry-Verified, visually distinct.
- `AIRecommendationCard` — light-blue surface, states the "why" and a concrete next action.
- `OpportunityCard` — role, company, match %, key skills, CTA all visible without opening it.
- `HeatmapPreview` — simple skill-demand-vs-capability grid component (build it now so it's reusable later even though there's no Institution page yet).
- Toast notifications, skeleton loaders (never a blank panel while an AI call is in flight), empty states that explain what's missing and what to do next.
- Icons: inline SVGs only, no icon libraries.

CODE STRUCTURE:
```
app/
  (student)/            student route group + layout (light shell)
  (recruiter)/          recruiter route group + layout (dark shell)
  api/
    extract-skills/route.ts
    explain-gap/route.ts
    rank-explain/route.ts
    assistant/route.ts
  login/
  globals.css
components/            shared primitives listed above
lib/
  ai.ts                Groq wrapper + the four typed AI functions — THE provider-swap seam
  matching.ts          deterministic rule-based skill-vector matching + score breakdown —
                        the AI never generates the match score itself, only explanations/extraction
  data.ts               mock students, companies, opportunities, applications, skill taxonomy
  role-context.tsx      "use client" React Context for the dummy-login role + localStorage sync
  types.ts              shared TypeScript interfaces: Student, Company, Skill, SkillVerification,
                        Opportunity, Application, LearningPath
.env.local.example     documents AI_API_KEY / AI_BASE_URL / AI_MODEL
README.md              structure overview, and how to swap the AI provider via .env.local, explain everything here, in very presise mannor with all the details included
```

DUMMY DATA: In `lib/data.ts`, seed ~12-15 mock students and ~8-10 mock opportunities across a couple of domains (frontend, data/AI, cloud) with realistic-looking skills, so `lib/matching.ts` has real inputs to score against — don't hardcode any match percentage, always compute it from the mock data.

DESIGN SYSTEM (treat as source of truth):
- Tokens as CSS variables in `:root`: Canvas #F6F9FB (student-facing background), Ink #0F1018 (headings, dark shell background), Primary #2469CB (primary actions/links/match states), Secondary blue #5670B6 (charts/supporting emphasis), Soft blue #AED1F0 (AI surfaces, selected states), Muted #979A9C (secondary copy), Success #20B486 (verified/complete), Warning #E7A33E (skill gaps/pending), Critical #D95C5C (high gap/blocking). Add a `[data-theme="dark"]` block for the recruiter shell.
- Typography: Inter, loaded via <link> in the root layout — 28-40px display headings, 14-16px body, 11-13px data labels. High weight contrast, avoid heavy bold inside dense tables.
- Shape/spacing: 8-16px card radius, 1px hairline borders, soft shadows only on elevated surfaces, 8px spacing base, 12-24px section spacing.
- Motion: 150-220ms for hover/selection, 250-350ms for modal/panel/stage transitions. Match score animates once on load; skill bars grow to their value; application timeline transitions between stages. No idle floating/parallax decoration. Respect prefers-reduced-motion.
- Interaction states: hover = subtle lift or border emphasis; selected = soft blue fill + stronger text; loading = skeleton; empty = explain + next step; destructive = reserve red (Critical) for actual risk only.
- Responsive: desktop = persistent sidebar + 12-col grid; tablet = condensed nav + 8-col; mobile = stacked cards, sticky primary action, horizontal skill chips, bottom nav for student flows. Sanity-check at 375px.
- Accessibility: WCAG-aware contrast, visible focus states, semantic headings, 44px minimum touch targets, no color-only status encoding, descriptive labels for charts/verification states.

QUALITY REQUIREMENTS:
- Every AI-derived value shown in the UI (match %, extracted skill, gap classification, candidate ranking) must be paired with a visible reason — never a bare percentage.
- Resume-extracted skills require explicit user confirmation before entering mock profile state.
- `npm run build` must succeed with no type errors; no console errors on any route.
- Verify: start the production server and curl every route above (including the 4 API routes with a sample POST body) expecting 200, then kill the server.
- Handle Groq API failures gracefully in the UI (toast + retry), since a live demo may hit rate limits — never let an AI call crash a page.
- Comment `lib/ai.ts` and `lib/matching.ts` clearly at the seams (env-based provider config, and the rule-based-vs-AI boundary).