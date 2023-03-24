import React from 'react'
import { PriceRange } from '../../'
import { OnFacetChange } from './Filter'

export type FacetRangeProps = {
  min: { selected: number; absolute: number }
  max: { selected: number; absolute: number }
  formatter: (price: number) => string
  facetKey: string
  /**
   * This function is called when `Checkbox` from the facet changes.
   */
  onFacetChange: OnFacetChange
}

const formatRange = (min: number, max: number) =>
  `${min.toFixed(2)}-to-${max.toFixed(2)}`

function FacetRange({
  min,
  max,
  formatter,
  facetKey,
  onFacetChange,
}: FacetRangeProps) {
  return (
    <PriceRange
      min={min}
      max={max}
      formatter={formatter}
      step={1}
      onEnd={(v) =>
        onFacetChange(
          {
            key: facetKey,
            value: formatRange(v.min, v.max),
          },
          'RANGE'
        )
      }
    />
  )
}

export default FacetRange
