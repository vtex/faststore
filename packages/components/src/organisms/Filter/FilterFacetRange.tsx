import React from 'react'
import { PriceRange } from '../..'
import { OnFacetChange } from './Filter'

export interface FilterFacetRangeProps {
  /**
   * The minimum value of the Slider Range Facet
   */
  min: { selected: number; absolute: number }
  /**
   * The maximum value of the Slider Range Facet
   */
  max: { selected: number; absolute: number }
  /**
   * String that identifies the current Facet key.
   */
  facetKey: string
  /**
   * Formatter function that transforms the raw price value and render the result.
   */
  formatter: (price: number) => string
  /**
   * This function is called when `Checkbox` from the facet changes.
   */
  onFacetChange: OnFacetChange
}

const formatRange = (min: number, max: number) =>
  `${min.toFixed(2)}-to-${max.toFixed(2)}`

function FilterFacetRange({
  min,
  max,
  formatter,
  facetKey,
  onFacetChange,
}: FilterFacetRangeProps) {
  return (
    <PriceRange
      data-fs-filter-facet-range
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

export default FilterFacetRange
