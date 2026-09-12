# NextGig - SIH 2026 MVP

NextGig is a skill intelligence platform bridging the gap between academia and industry. Built for the SIH 2026 hackathon (Problem Statement 26044).

## Overview
This repository contains the Next.js 14 frontend MVP. It features a completely working interactive demo using a deterministic skill-matching engine, powered by AI for text parsing and subjective skill assessment. 

The demo does not currently require a backend database (data is persisted via browser storage) and is designed to be easily wired up to the *Insforge* backend services in the future.

## Key Features
- **AI-Powered CV Parsing:** Extract structured data from raw resumes.
- **Dynamic Assessments:** AI generates unique test questions based on the candidate's self-declared skills.
- **Deterministic Matching Engine:** A non-AI, mathematically weighted engine matching student capability against recruiter opportunity requirements.
- **Student Dashboard:** View readiness score, skill gaps, AI recommendations, and top matches.
- **Recruiter Dashboard:** See an AI-ranked talent pipeline and skill supply/demand heatmaps.
- **Dark & Light Mode:** Themed environments with a forced "Recruiter Dark Mode" workspace.

## Tech Stack
- **Framework:** Next.js (App Router)
- **Styling:** Tailwind CSS + custom CSS Variables design system
- **UI Components:** Shadcn UI + Framer Motion
- **AI Integration:** Provider-agnostic API routes (`lib/ai.ts`)

## Getting Started

1. Clone the repository
2. Install packages: `npm install`
3. Copy `.env.local.example` to `.env.local`
4. Add your OpenAI/Anthropic/compatible API key to `.env.local`
5. Run the dev server: `npm run dev`
6. Open [http://localhost:3000](http://localhost:3000)

Click **"Try the Demo"** to access the dummy login page and swap between the Student and Recruiter personas.

## Documentation
Please check the `docs/` folder for detailed guides:
- [Architecture Overview](docs/architecture.md)
- [Developer & Troubleshooting Guide](docs/developer_guide.md)
