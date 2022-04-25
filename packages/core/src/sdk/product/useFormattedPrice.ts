import { useMemo } from 'react'
import { useSession } from '@faststore/sdk'

export const useFormattedPrice = (price: number) => {
  const { currency, locale } = useSession()

  return useMemo(
    () =>
      Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currency.code,
      }).format(price),
    [currency.code, locale, price]
  )
}
