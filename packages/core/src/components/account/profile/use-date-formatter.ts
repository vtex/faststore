import { useCallback, useMemo } from 'react'

export function useDateFormatter(locale: string) {
  const dateFormatter = useMemo(
    () =>
      new Intl.DateTimeFormat(locale, {
        dateStyle: 'medium',
      }),
    [locale]
  )

  const formatStringDate = useCallback(
    (dateString: string) => {
      const date = new Date(dateString)
      const formattedDate = dateFormatter.format(date)
      return formattedDate
    },
    [dateFormatter]
  )

  return {
    dateFormatter,
    formatStringDate,
  }
}
