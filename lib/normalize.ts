// ── Date normalisation ────────────────────────────────────────────────
// The resume parser is an LLM reading free-form CV text, so the dates it
// emits are whatever the CV said: "2023", "May 2023", "05/2023",
// "2023-05-17", "Expected Dec 2026", or nothing at all.
//
// `certifications.date` is a real date column, so an unparseable value must
// become NULL rather than an empty string — `''::date` raises
// 22007 invalid_input_syntax and fails the whole insert, which is what used
// to drop every certification on the floor when one of them lacked a date.
//
// Year-only and month-year values are widened to the first day of the
// period, which is the conventional reading of "certified in 2023" and keeps
// the column sortable.

/** Matches an ISO-ish date: 2023-05-17, 2023/5/17. */
const ISO_LIKE = /^(\d{4})[-/](\d{1,2})(?:[-/](\d{1,2}))?$/;

/** Matches a bare year, optionally prefixed ("Expected 2026"). */
const YEAR_ONLY = /(?:^|\s)(19|20)(\d{2})(?:\s|$)/;

/** Matches "May 2023", "Sept 2023", "December, 2023". */
const MONTH_NAME_YEAR =
  /\b(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\.?,?\s+((?:19|20)\d{2})\b/i;

/** Matches "05/2023" and "5-2023". */
const MONTH_YEAR_NUMERIC = /^(\d{1,2})[-/]((?:19|20)\d{2})$/;

const MONTH_INDEX: Record<string, number> = {
  jan: 1, feb: 2, mar: 3, apr: 4, may: 5, jun: 6,
  jul: 7, aug: 8, sep: 9, oct: 10, nov: 11, dec: 12,
};

function pad(value: number): string {
  return String(value).padStart(2, "0");
}

/** Real calendar check — rejects 2023-02-30 and month 13. */
function isRealDate(year: number, month: number, day: number): boolean {
  if (month < 1 || month > 12 || day < 1 || day > 31) return false;
  const candidate = new Date(Date.UTC(year, month - 1, day));
  return (
    candidate.getUTCFullYear() === year &&
    candidate.getUTCMonth() === month - 1 &&
    candidate.getUTCDate() === day
  );
}

/**
 * Normalises a free-form date into `YYYY-MM-DD`, or returns null when the
 * value carries no usable date at all.
 *
 * Never returns an empty string: callers write the result straight into a
 * nullable date column.
 */
export function normalizeDate(value: unknown): string | null {
  if (typeof value !== "string") return null;

  const raw = value.trim();
  if (raw === "") return null;

  const iso = ISO_LIKE.exec(raw);
  if (iso) {
    const year = Number(iso[1]);
    const month = Number(iso[2]);
    const day = iso[3] === undefined ? 1 : Number(iso[3]);
    if (isRealDate(year, month, day)) {
      return `${year}-${pad(month)}-${pad(day)}`;
    }
    // A well-shaped but impossible date (2023-02-30) still tells us the
    // month, which is more information than discarding the value entirely.
    if (month >= 1 && month <= 12) return `${year}-${pad(month)}-01`;
    return `${year}-01-01`;
  }

  const numeric = MONTH_YEAR_NUMERIC.exec(raw);
  if (numeric) {
    const month = Number(numeric[1]);
    const year = Number(numeric[2]);
    if (month >= 1 && month <= 12) return `${year}-${pad(month)}-01`;
    return `${year}-01-01`;
  }

  const named = MONTH_NAME_YEAR.exec(raw);
  if (named) {
    const month = MONTH_INDEX[named[1].toLowerCase()];
    return `${named[2]}-${pad(month)}-01`;
  }

  const year = YEAR_ONLY.exec(raw);
  if (year) return `${year[1]}${year[2]}-01-01`;

  return null;
}

/**
 * Trims a free-form string, returning null when nothing is left.
 * Used for optional text columns so a blank issuer is stored as NULL rather
 * than as an empty string masquerading as data.
 */
export function normalizeOptionalText(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed === "" ? null : trimmed;
}

/**
 * A timestamp for columns that must always carry one (`assessments.date`).
 * Postgres casts a full ISO-8601 string to either `date` or `timestamptz`,
 * so this is safe whichever type the column has.
 */
export function nowIso(): string {
  return new Date().toISOString();
}
