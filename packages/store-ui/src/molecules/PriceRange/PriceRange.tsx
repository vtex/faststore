import React, { useState } from 'react'

import type { PriceProps } from '../../atoms/Price'
import Price from '../../atoms/Price'
import type { SliderProps } from '../../atoms/Slider'
import Slider from '../../atoms/Slider'

export type PriceRangeProps = SliderProps & {
  /**
   * The current use case variant for prices.
   */
  variant?: PriceProps['variant']
  /**
   * Formatter function that transforms the raw price value and render the result.
   */
  formatter: PriceProps['formatter']
  /**
   * Returns the value of element's class content attribute.
   */
  className?: string
}

const PriceRange = ({
  className,
  formatter,
  max,
  min,
  onChange,
  testId = 'store-price-range',
  variant,
}: PriceRangeProps) => {
  const [minVal, setMinVal] = useState(min)
  const [maxVal, setMaxVal] = useState(max)

  const handleChange: SliderProps['onChange'] = (values) => {
    if (values.min !== minVal) {
      setMinVal(values.min)
    }

    if (values.max !== maxVal) {
      setMaxVal(values.max)
    }

    onChange?.(values)
  }

  return (
    <div data-store-price-range data-testid={testId} className={className}>
      <Slider min={min} max={max} onChange={handleChange} />
      <div data-store-price-range-values>
        <Price
          formatter={formatter}
          data-store-price-range-value="min"
          value={minVal}
          variant={variant}
        />
        <Price
          formatter={formatter}
          data-store-price-range-value="max"
          value={maxVal}
          variant={variant}
        />
      </div>
    </div>
  )
}

export default PriceRange
