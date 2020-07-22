import memoizeFormatConstructor from 'intl-format-cache'

import { useCurrency } from './Currency'
import { useLocale } from './Locale'

const memoizedConstructor = memoizeFormatConstructor(Intl.NumberFormat)

export const useNumberFormat = () => {
  const [currency] = useCurrency()
  const [locale] = useLocale()
  const numberFormat = memoizedConstructor(locale, {
    currency,
    style: 'currency',
  }) as Intl.NumberFormat

  return numberFormat
}
