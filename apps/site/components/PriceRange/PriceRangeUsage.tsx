import React from 'react'
import { PriceRange } from '@faststore/ui'

import { useFormattedPrice } from '../utilities/usePriceFormatter'

const PriceRangeUsage = () => {
  return (
    <PriceRange
      max={{ absolute: 500, selected: 250 }}
      min={{ absolute: 0, selected: 100 }}
      formatter={useFormattedPrice}
      step={1}
    />
  )
}

export default PriceRangeUsage
