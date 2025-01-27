/**
 * Formats a given date into a readable string.
 * If the date is today, it returns "Today".
 * Otherwise, it formats the date as "MMM DD, YYYY" based on the specified locale.
 */
export function formatDateReviewCard(date: Date, locale: string): string {
  const today = new Date()

  if (
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate()
  ) {
    return 'Today'
  }

  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }

  return date.toLocaleDateString(locale, options)
}
