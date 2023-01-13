import React, { useCallback } from 'react'
import { PriceRange } from '@faststore/ui'

const PriceRangeUsage = () => {
  const formatter = useCallback(
    (price: number) =>
      new Intl.NumberFormat('en-GB', {
        style: 'currency',
        currency: 'EUR',
      }).format(price),
    []
  )

  return (
    <PriceRange
      max={{ absolute: 500, selected: 250 }}
      min={{ absolute: 0, selected: 100 }}
      formatter={formatter}
    />
  )
}

export default PriceRangeUsage
