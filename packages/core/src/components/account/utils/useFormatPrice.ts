import { useRouter } from 'next/router'
import { useCallback } from 'react'

// Format price values according to the specified currency (converts cents to standard units)
export const useFormatPrice = () => {
  // get locale from router instead of using useSession to avoid SSR hydration issues
  const { locale } = useRouter()

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
