import { useCallback, useMemo } from 'react'
import { useSession } from '@faststore/sdk'

export const usePriceFormatter = () => {
  const { currency, locale } = useSession()

  return useCallback(
    (price: number) =>
      Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currency.code,
      }).format(price),
    [currency.code, locale]
  )
}

export const useFormattedPrice = (price: number) => {
  const formatter = usePriceFormatter()

  return useMemo(() => formatter(price), [formatter, price])
}
