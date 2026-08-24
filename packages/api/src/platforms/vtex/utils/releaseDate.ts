/**
 * `StoreProduct.releaseDate` is documented in the schema as ISO 8601, but
 * Intelligent Search delivers whatever the account has stored — epoch
 * milliseconds for some, an ISO string for others. Normalizing here keeps the
 * resolver honest about the contract it advertises.
 */

// Epoch values are disambiguated by magnitude, not digit count: anything at or
// above this is milliseconds (>= 1973-03-03), anything below is seconds. A
// millisecond value under the threshold is read as seconds — accepted, since no
// real catalog carries a release date that early, and a digit-count heuristic
// leaves a strictly larger hole (9-digit seconds and 12-digit milliseconds both
// fall through to the string parser, which reads them as a year).
const MILLISECONDS_THRESHOLD = 1e11

const isAllDigits = (value: string) => /^\d+$/.test(value)

const toDate = (value: string): Date => {
  if (!isAllDigits(value)) {
    return new Date(value)
  }

  const epoch = Number(value)

  return new Date(epoch >= MILLISECONDS_THRESHOLD ? epoch : epoch * 1000)
}

/**
 * Normalizes a release date to an ISO 8601 calendar date (`YYYY-MM-DD`).
 *
 * Accepts epoch milliseconds, epoch seconds, and date strings. Returns an empty
 * string when the input is absent or unparseable — never throws, and never
 * returns `"Invalid Date"`.
 *
 * The calendar day is always taken in UTC, so a build produces the same markup
 * on any machine. An input carrying a timezone offset is converted first, which
 * means `2026-03-23T21:00:00-05:00` normalizes to `2026-03-24`. That is
 * deliberate: preserving the source calendar day would make the output depend on
 * the offset embedded in each record.
 */
export const normalizeReleaseDate = (
  value: string | number | null | undefined
): string => {
  if (value === null || value === undefined) {
    return ''
  }

  const raw = String(value).trim()

  if (raw === '') {
    return ''
  }

  const date = toDate(raw)

  if (Number.isNaN(date.getTime())) {
    return ''
  }

  return date.toISOString().slice(0, 10)
}
