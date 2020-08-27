import { useMemo } from 'react'

import { formatCurrency } from '../FormattedCurrency/formatCurrency'

export const useFormattedPrice = (value?: number | null) => {
  const formattedPrice = useMemo(() => {
    if (value == null) {
      return 'TBD'
    }

    if (value === 0) {
      return 'FREE'
    }

    return formatCurrency(value)
  }, [value])

  return formattedPrice
}
