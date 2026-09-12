# Developer Guide

This guide explains how to modify, extend, and fix the NextGig frontend MVP.

## Getting Started Locally

1. Clone the repository.
2. Install dependencies: `npm install`
3. Copy `.env.local.example` to `.env.local` and add your LLM API key.
4. Run the development server: `npm run dev`
5. Open `http://localhost:3000`

## Adding a New Shadcn Component

We use Shadcn UI for our base components. To add a new component, do not try to run `npx shadcn-ui@latest add <component>`. Since we are manually crafting the MVP, you can often just copy the raw code from the Shadcn docs into `components/ui/` or ask the AI assistant to write the component for you using the standard Radix UI + Tailwind approach.

## Modifying the Design System

The global design system is housed in `app/globals.css`. 

### Changing Colors
We use CSS variables for colors to support easy theming. Look for the `:root` and `.dark` blocks in `globals.css`.
- `--ng-primary`: The main brand color (blue/indigo).
- `--ng-secondary`: The secondary brand color (purple).
- `--ng-success`, `--ng-warning`, `--ng-critical`: Status colors.

### The Recruiter Theme
Recruiters get a special forced dark mode to distinguish their workspace. If you need to modify this, look for the `[data-theme="dark"]` overrides in `globals.css` and the forced effect in `app/recruiter/[slug]/layout.tsx`.

## Troubleshooting

### "The Assessment isn't loading / fails to submit"
- Ensure your `.env.local` has a valid API key.
- The AI expects JSON responses. Sometimes weaker models fail to output valid JSON. If using a custom model, ensure it's capable of JSON mode or strict instruction following. Check the `console.log` in `app/api/evaluate-assessment/route.ts` if parsing fails.

### "My Dashboard has no data"
- The mock data relies on `localStorage`. If you clear your browser data or use incognito mode, you will need to go through the onboarding flow again or click the "Try the Demo" button on the homepage to re-seed the session.

### "Framer Motion animations are glitching"
- Ensure you are wrapping dynamic lists in `<AnimatePresence>` if elements are being added or removed from the DOM.
- For simple entrance animations, stick to `initial={{ opacity: 0, y: 10 }}` and `animate={{ opacity: 1, y: 0 }}` on `motion.div`.

## Changing the Matching Algorithm
If you need to tweak how match scores are calculated, edit `lib/matching.ts`. The weights are hardcoded as constants at the top of the file:
```typescript
const WEIGHTS = {
  SKILLS: 0.60,
  EDUCATION: 0.15,
  EXPERIENCE: 0.10,
  VERIFICATION: 0.15,
};
```
Change these to adjust the bias of the algorithm.
