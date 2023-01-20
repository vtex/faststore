import { useCallback, useMemo } from 'react'

interface PriceFormatterOptions {
  decimals?: boolean
}

export const usePriceFormatter = ({ decimals }: PriceFormatterOptions = {}) => {
  return useCallback(
    (price: number) =>
      Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: decimals ? 2 : 0,
      }).format(price),
    [decimals]
  )
}

export const useFormattedPrice = (price: number) => {
  const formatter = usePriceFormatter()

  return useMemo(() => formatter(price), [formatter, price])
}
