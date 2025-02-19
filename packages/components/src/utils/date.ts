/**
 * Formats a given date into a readable string.
 * If the date is today, it returns "Today".
 * Otherwise, it formats the date as "MMM DD, YYYY" based on the specified locale.
 */
export function formatDate(date: Date, locale = 'en-US'): string {
  const today = new Date()

  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }

  const todayString = today.toLocaleDateString(locale, options)
  const dateString = date.toLocaleDateString(locale, options)

  if (dateString === todayString) {
    return 'Today'
  }

  return dateString
}
