import memoizeFormatConstructor from 'intl-format-cache'

import { useCurrency } from './useCurrency'
import { useLocale } from './useLocale'

const memoizedConstructor = memoizeFormatConstructor(Intl.NumberFormat)

export const useNumberFormat = () => {
  const [currency] = useCurrency()
  const locale = useLocale()
  const numberFormat = memoizedConstructor(locale, {
    currency,
    style: 'currency',
  }) as Intl.NumberFormat

  return numberFormat
}
