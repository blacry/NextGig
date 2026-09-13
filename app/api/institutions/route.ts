import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

const DEFAULT_INSTITUTIONS = [
  "RV Institute of Technology, Bengaluru",
  "Indian Institute of Technology, Delhi",
  "Indian Institute of Technology, Bombay",
  "National Institute of Technology, Karnataka",
  "BITS Pilani, Pilani Campus",
  "Indian Institute of Science, Bengaluru",
  "Delhi Technological University, New Delhi",
];

export async function GET() {
  try {
    const supabase = await createClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const db = supabase as any;
    const { data: dbInstitutions, error } = await db
      .from("institutions")
      .select("name, city, state")
      .order("name", { ascending: true });

    if (error) {
      console.warn("[api/institutions] DB lookup error:", error.message);
      return NextResponse.json({ institutions: DEFAULT_INSTITUTIONS });
    }

    // The picker value is later used to link a student to this exact database
    // record. Keep it as the canonical name; appending the city here made the
    // value impossible to match during student onboarding.
    const fetchedNames = (dbInstitutions || []).map(
      (inst: { name: string }) => inst.name
    );

    // Merge and deduplicate
    const combined = Array.from(
      new Set([...DEFAULT_INSTITUTIONS, ...fetchedNames])
    );

    return NextResponse.json({ institutions: combined });
  } catch (error) {
    console.error("[api/institutions] unexpected error:", error);
    return NextResponse.json({ institutions: DEFAULT_INSTITUTIONS });
  }
}
