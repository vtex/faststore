import React, { useRef, useImperativeHandle, forwardRef } from 'react'
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

type PriceRangeRefType = {
  setPriceRangeValues: (values: { min: number; max: number }) => void
}

const PriceRange = forwardRef<PriceRangeRefType | undefined, PriceRangeProps>(
  function PriceRange(
    {
      className,
      formatter,
      max,
      min,
      onChange,
      onEnd,
      testId = 'store-price-range',
      variant,
      'aria-label': ariaLabel,
    },
    ref
  ) {
    const sliderRef = useRef<{
      setSliderValues: (values: { min: number; max: number }) => void
    }>()

    useImperativeHandle(ref, () => ({
      setPriceRangeValues: (values: { min: number; max: number }) => {
        onChange?.(values)
        sliderRef.current?.setSliderValues(values)
      },
    }))

    return (
      <div data-store-price-range data-testid={testId} className={className}>
        <Slider
          ref={sliderRef}
          min={min}
          max={max}
          onEnd={onEnd}
          aria-label={ariaLabel}
          onChange={(value) => onChange?.(value)}
          minValueLabelComponent={(minValue) => (
            <Price
              value={minValue}
              variant={variant}
              formatter={formatter}
              style={{
                position: 'absolute',
                left: `calc(${minValue}% + (${8 - minValue * 0.2}px))`,
              }}
              data-price-range-value-label="min"
            />
          )}
          maxValueLabelComponent={(maxValue) => (
            <Price
              formatter={formatter}
              variant={variant}
              value={maxValue}
              style={{
                position: 'absolute',
                left: `calc(${maxValue}% + (${8 - maxValue * 0.2}px))`,
              }}
              data-price-range-value-label="max"
            />
          )}
        />
      </div>
    )
  }
)

export default PriceRange
