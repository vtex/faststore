import React, { useState } from 'react'
import type { AriaAttributes } from 'react'

import Price from '../../atoms/Price'
import Slider from '../../atoms/Slider'
import type { PriceProps } from '../../atoms/Price'
import type { SliderProps } from '../../atoms/Slider'

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
  /**
   * Defines a string value that labels the current element.
   */
  'aria-label'?: AriaAttributes['aria-label']
}

const PriceRange = ({
  className,
  formatter,
  max,
  min,
  onChange,
  onEnd,
  testId = 'store-price-range',
  variant,
  'aria-label': ariaLabel,
  ...otherProps
}: PriceRangeProps) => {
  const [edges, setEdges] = useState({ min: min.selected, max: max.selected })

  return (
    <div data-store-price-range data-testid={testId} className={className}>
      <Slider
        min={min}
        max={max}
        onEnd={onEnd}
        onChange={(value) => {
          setEdges(value)
          onChange?.(value)
        }}
        aria-label={ariaLabel}
        {...otherProps}
      />
      <div data-price-range-values>
        <Price
          formatter={formatter}
          data-price-range-value="min"
          value={edges.min}
          variant={variant}
        />
        <Price
          formatter={formatter}
          data-price-range-value="max"
          value={edges.max}
          variant={variant}
        />
      </div>
    </div>
  )
}

export default PriceRange
