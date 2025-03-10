/**
 * Formats date into a localized string.
 * @param date - The Date object to format
 * @param locale - The locale identifier (e.g., 'en-US', 'fr-FR'). Defaults to 'en-US'
 * @returns A string in the format "MMM D, YYYY" for en-US (e.g., "Jan 15, 2024")
 *          Format will vary based on the provided locale
 */
export function formatDate(date: Date, locale = 'en-US'): string {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }

  return date.toLocaleDateString(locale, options)
}
