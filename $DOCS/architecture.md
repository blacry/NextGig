# NextGig Project Documentation

## Architecture Overview

NextGig is a full stack MVP built for the SIH 2026 hackathon PS 26044. It uses a modern Next.js 14 stack (App Router) with React, TypeScript, and Tailwind CSS. The design system leverages Shadcn UI and Framer Motion for premium, animated interfaces.

### Core Stack
- **Framework:** Next.js (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS + CSS Variables (`globals.css`)
- **Components:** Shadcn UI (accessible, unstyled primitives wrapped in Tailwind)
- **Animations:** Framer Motion
- **State Management:** React Context API + LocalStorage/SessionStorage (for persistence without a DB)

### Key Directories
- `app/`: Next.js App Router structure. Contains all pages, layouts, and API routes.
  - `app/api/`: Contains dummy API routes for the AI wrapper (e.g., `/api/evaluate-assessment`).
  - `app/onboarding/`: The 5-step student onboarding flow.
  - `app/student/`: The student dashboard and opportunities view.
  - `app/recruiter/`: The recruiter dashboard.
- `components/`: Reusable UI components.
  - `components/ui/`: Shadcn primitive components.
  - `components/layout/`: Layout wrappers like the Sidebar.
  - `components/shared/`: Shared components like ThemeToggle, SkillMeter, StatCard, OpportunityCard, etc.
- `lib/`: Business logic, types, and utilities.
  - `lib/ai.ts`: The provider-agnostic wrapper for OpenAI-compatible LLMs. Handles all AI generation tasks.
  - `lib/matching.ts`: The deterministic scoring engine. Calculates match percentages without relying on AI.
  - `lib/data.ts`: Mock data for the MVP (Opportunities, Students).
  - `lib/types.ts`: TypeScript interfaces for the entire app.
- `docs/`: This folder, containing detailed documentation on how the app works.

## How State is Managed

The MVP integrates with **Supabase** for robust backend infrastructure, utilizing a PostgreSQL database and Supabase Auth.

1. **Supabase Database:** Core data models for users, profiles, opportunities, and applications are persisted in the database.
2. **Supabase Auth:** Handles secure user authentication and session management.
3. **Context API:** 
   - Application context providers are used to distribute authenticated user state and data across the component tree without prop drilling.
4. **Local & Session Storage:** Used selectively for temporary, transient state during multi-step flows (like onboarding), preventing data loss on accidental refreshes before final submission.

## How the Matching Engine Works (`lib/matching.ts`)

The user requested a strict separation of concerns: AI is for text extraction and chat, but a deterministic engine is the source of truth for match percentages.

The `calculateMatchScore` function uses a weighted algorithm:
- **Skill Match (60%):** Compares the candidate's skill levels against the opportunity's required skills.
- **Education Match (15%):** Checks if the domain/degree aligns.
- **Experience Match (10%):** A simple heuristic based on the number of projects.
- **Verification Bonus (15%):** Rewards candidates who have verified their skills (either via AI assessment or professor endorsement).

## How the AI Integration Works (`lib/ai.ts`)

We use a provider-agnostic wrapper designed to hit any OpenAI-compatible endpoint. You can switch between OpenAI, Anthropic, or an open-source model simply by changing the environment variables in `.env.local`.

- `AI_API_KEY`: Your API key.
- `AI_BASE_URL`: The endpoint URL (default is `https://api.openai.com/v1`).
- `AI_MODEL`: The model name (e.g., `gpt-4o`, `gpt-3.5-turbo`).

The AI handles:
1. Parsing unstructured CV text and extracting GitHub profile context into a structured JSON profile.
2. Generating a dynamic, 3-question assessment based on the user's claimed skills.
3. Evaluating the subjective answers and updating the user's skill levels.
4. Providing actionable gap analysis and recommendations.

## Future Integration (Insforge)
This frontend is built to be easily wired into the "Insforge" backend later. The API boundaries are clean (e.g., `fetch('/api/evaluate-assessment')`), meaning you can swap out the mock Next.js API routes with real endpoints once the backend is ready.
