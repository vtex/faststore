import React, { useRef, useImperativeHandle, forwardRef } from 'react'
import type { AriaAttributes } from 'react'

import { Price } from '@faststore/components'
import type { PriceProps } from '@faststore/components'

import Slider from '../../atoms/Slider'
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
      step,
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
      <div data-fs-price-range data-testid={testId} className={className}>
        <Slider
          ref={sliderRef}
          min={min}
          max={max}
          step={step}
          onEnd={onEnd}
          aria-label={ariaLabel}
          onChange={(value) => onChange?.(value)}
          minValueLabelComponent={(minValue) => {
            const minPercent = (minValue / max.absolute) * 100

            return (
              <Price
                value={minValue}
                variant={variant}
                formatter={formatter}
                data-price-range-value-label="min"
                style={{
                  position: 'absolute',
                  left: `calc(${minPercent}% + (${8 - minPercent * 0.2}px))`,
                }}
              />
            )
          }}
          maxValueLabelComponent={(maxValue) => {
            const maxPercent = (maxValue / max.absolute) * 100

            return (
              <Price
                formatter={formatter}
                variant={variant}
                value={maxValue}
                data-price-range-value-label="max"
                style={{
                  position: 'absolute',
                  left: `calc(${maxPercent}% + (${8 - maxPercent * 0.2}px))`,
                }}
              />
            )
          }}
        />
      </div>
    )
  }
)

export default PriceRange
