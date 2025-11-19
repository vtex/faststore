import React from 'react'
import { PriceRange } from '../..'
import type { OnFacetChange } from './Filter'

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
   * Formatter function that transforms the raw value and render the result.
   */
  formatter: (value: number) => string
  /**
   * This function is called when `Checkbox` from the facet changes.
   */
  onFacetChange: OnFacetChange
  /**
   * Label for the minimum value input field.
   */
  minLabel?: string
  /**
   * Label for the maximum value input field.
   */
  maxLabel?: string
  /**
   * Error message when minimum price is greater than maximum price.
   */
  minPriceGreaterThanMaxErrorMessage?: string
  /**
   * Error message when maximum price is smaller than minimum price.
   */
  maxPriceSmallerThanMinErrorMessage?: string
}

const formatRange = (min: number, max: number) =>
  `${min.toFixed(2)}-to-${max.toFixed(2)}`

function FilterFacetRange({
  min,
  max,
  formatter,
  facetKey,
  onFacetChange,
  minLabel,
  maxLabel,
  minPriceGreaterThanMaxErrorMessage,
  maxPriceSmallerThanMinErrorMessage,
}: FilterFacetRangeProps) {
  return (
    <PriceRange
      data-fs-filter-facet-range
      min={min}
      max={max}
      formatter={formatter}
      step={1}
      minLabel={minLabel}
      maxLabel={maxLabel}
      minPriceGreaterThanMaxErrorMessage={minPriceGreaterThanMaxErrorMessage}
      maxPriceSmallerThanMinErrorMessage={maxPriceSmallerThanMinErrorMessage}
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
