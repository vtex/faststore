import React, { useRef, useState, useImperativeHandle, forwardRef } from 'react'
import type { AriaAttributes } from 'react'

import { Price, Slider, InputField } from '../../'
import type { PriceProps, SliderProps } from '../../'

export interface PriceRangeProps extends Omit<SliderProps, 'absoluteValuesLabel'> {
  /**
   * The current use case variant for prices.
   */
  variant?: PriceProps['variant']
  /**
   * Formatter function that transforms the raw price value and render the result.
   */
  formatter: PriceProps['formatter']
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
      formatter,
      max,
      min,
      step = 1,
      onChange,
      onEnd,
      testId = 'fs-price-range',
      variant,
      'aria-label': ariaLabel,
      ...otherProps
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

    const [inputMinError, setInputMinError] = useState<string>()
    const [inputMaxError, setInputMaxError] = useState<string>()
    const [priceRange, setPriceRange] = useState<{ min: number; max: number }>({
      min: Math.floor(min.selected),
      max: Math.round(max.selected),
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
    }

    function onChangeInputMin(value: string) {
      setInputMinError(undefined)

      if (Number(value) < Math.floor(min.absolute)) {
        return
      }

      if (Number(value) > Math.floor(priceRange.max)) {
        setInputMinError(`Min price can't be greater than max`)
      }

      setPriceRange({ ...priceRange, min: Number(value) })
      sliderRef.current?.setSliderValues({
        ...priceRange,
        min: Number(value),
      })
    }

    function onChangeInputMax(value: string) {
      setInputMaxError(undefined)

      if (Number(value) > Math.round(max.absolute)) {
        return
      }

      if (Number(value) < Math.round(priceRange.min)) {
        setInputMaxError(`Max price can't be smaller than min`)
      }

      setPriceRange({ ...priceRange, max: Number(value) })
      sliderRef.current?.setSliderValues({
        ...priceRange,
        max: Number(value),
      })
    }

    return (
      <div data-fs-price-range data-testid={testId} {...otherProps}>
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
          onChange={(value) => onChange?.(value)}
          absoluteValuesLabel={{
            min: (
              <Price
                value={Math.floor(min.absolute)}
                variant={variant}
                formatter={formatter}
              />
            ),
            max: (
              <Price
                value={Math.round(max.absolute)}
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
              <Price value={maxValue} variant={variant} formatter={formatter} />
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
            min={Math.floor(min.absolute)}
            max={priceRange.max}
            value={priceRange.min}
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
            max={Math.round(max.absolute)}
            min={priceRange.min}
            value={priceRange.max}
            onChange={(e) => onChangeInputMax(e.target.value)}
            onBlur={() => !inputMaxError && onEnd?.(priceRange)}
          />
        </div>
      </div>
    )
  }
)

export default PriceRange
