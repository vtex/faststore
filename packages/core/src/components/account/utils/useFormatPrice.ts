import { useSession } from '../../../sdk/session'
import { useCallback } from 'react'

// Format price values according to the specified currency (converts cents to standard units)
export const useFormatPrice = () => {
  const { locale } = useSession()

  return useCallback(
    (value: number, currencyCode: string) => {
      return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currencyCode,
        minimumFractionDigits: 2,
      }).format(value / 100)
    },
    [locale]
  )
}
