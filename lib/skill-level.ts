// ── Skill level narrowing ─────────────────────────────────────────────
// `student_skills.level`, `assessments.level` and
// `opportunity_skills.required_level` are smallint columns, so the generated
// types expose them as plain `number`. The `check (... between 1 and 5)`
// constraint that actually keeps them in range lives in Postgres and has no
// TypeScript equivalent, so every read has to narrow before it can produce a
// SkillLevel.
//
// Clamping rather than throwing is deliberate: a row that somehow sits
// outside 1-5 should render as a valid chip at the nearest level, not take
// down the page it appears on.

import type { SkillLevel } from "./types";

/** Clamps an arbitrary number into the 1-5 range the schema allows. */
export function toSkillLevel(value: number | null | undefined): SkillLevel {
  const rounded = Math.round(value ?? 1);
  return Math.min(5, Math.max(1, rounded)) as SkillLevel;
}
