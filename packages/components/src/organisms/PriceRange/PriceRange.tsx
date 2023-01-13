import React, { useRef, useState, useImperativeHandle, forwardRef } from 'react'
import type { AriaAttributes } from 'react'

import { Price } from '@faststore/components'
import type { PriceProps } from '@faststore/components'

import { Slider } from '@faststore/components'
import type { SliderProps } from '@faststore/components'

import { InputField } from '@faststore/components'

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
      testId = 'fs-price-range',
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

    const inputMinRef = useRef<HTMLInputElement>(null)
    const inputMaxRef = useRef<HTMLInputElement>(null)
    const priceRangeRef = useRef<{
      setPriceRangeValues: (values: { min: number; max: number }) => void
    }>()

    const [inputMinError, setInputMinError] = useState<string>()
    const [inputMaxError, setInputMaxError] = useState<string>()
    const [priceRange, setPriceRange] = useState<{ min: number; max: number }>({
      min: Math.round(min.selected),
      max: Math.ceil(max.selected),
    })

    function onChangePriceRange(value: { min: number; max: number }) {
      setInputMinError(undefined)
      setInputMaxError(undefined)
      setPriceRange({ min: value.min, max: value.max })

      if (inputMinRef.current?.value) {
        inputMinRef.current.value = String(value.min)
      }

      if (inputMaxRef.current?.value) {
        inputMaxRef.current.value = String(value.max)
      }
      console.log('onChangePriceRange', priceRange)
    }

    function onChangeInputMin(value: string) {
      setInputMinError(undefined)

      if (Number(value) < min.absolute) {
        return
      }

      if (Number(value) > priceRange.max) {
        setInputMinError(`Min price can't be greater than max`)
      }

      setPriceRange({ ...priceRange, min: Number(value) })
      priceRangeRef.current?.setPriceRangeValues({
        ...priceRange,
        min: Number(value),
      })

      console.log('onChangeInputMin', priceRange)
    }

    function onChangeInputMax(value: string) {
      setInputMaxError(undefined)

      if (Number(value) > max.absolute) {
        return
      }

      if (Number(value) < priceRange.min) {
        setInputMaxError(`Max price can't be smaller than min`)
      }

      setPriceRange({ ...priceRange, max: Number(value) })
      priceRangeRef.current?.setPriceRangeValues({
        ...priceRange,
        max: Number(value),
      })

      console.log('onChangeInputMax', priceRange)
    }

    return (
      <div data-fs-price-range data-testid={testId} className={className}>
        <Slider
          ref={sliderRef}
          min={min}
          max={max}
          step={step}
          onEnd={(value) => {
            onEnd?.(value)
            onChangePriceRange(value)
          }}
          aria-label={ariaLabel}
          // onChange={(value) => onChange?.(value)}
          absoluteValuesLabel={{
            min: (
              <Price
                value={min.absolute}
                variant={variant}
                formatter={formatter}
              />
            ),
            max: (
              <Price
                value={max.absolute}
                variant={variant}
                formatter={formatter}
              />
            ),
          }}
          minValueLabelComponent={(minValue) => {
            return (
              <Price value={minValue} variant={variant} formatter={formatter} />
            )
          }}
          maxValueLabelComponent={(maxValue) => {
            return (
              <Price formatter={formatter} variant={variant} value={maxValue} />
            )
          }}
        />
        <div data-fs-price-range-inputs>
          <InputField
            id="price-range-min"
            step={step}
            label="Min"
            type="number"
            inputMode="numeric"
            error={inputMinError}
            inputRef={inputMinRef}
            min={Math.round(min.absolute)}
            max={Math.ceil(priceRange.max)}
            value={Math.round(priceRange.min)}
            onChange={(e) => onChangeInputMin(e.target.value)}
            onBlur={() => !inputMinError && onEnd?.(priceRange)}
          />
          <InputField
            id="price-range-max"
            label="Max"
            step={step}
            type="number"
            inputMode="numeric"
            error={inputMaxError}
            inputRef={inputMaxRef}
            max={Math.ceil(max.absolute)}
            min={Math.round(priceRange.min)}
            value={Math.ceil(priceRange.max)}
            onChange={(e) => onChangeInputMax(e.target.value)}
            onBlur={() => !inputMaxError && onEnd?.(priceRange)}
          />
        </div>
      </div>
    )
  }
)

export default PriceRange
