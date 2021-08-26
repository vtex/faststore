/**
 * This code is inspired by the work of [sandra-lewis](https://codesandbox.io/u/sandra-lewis)
 */

import React, { useCallback, useEffect, useRef, useState } from 'react'

export type SliderProps = {
  /**
   * The minimum value of the slider.
   */
  min: number
  /**
   * The maximum value of the slider.
   */
  max: number
  /**
   * Show selected values.
   *
   * @default true
   */
  showValues?: boolean
  /**
   * ID to find this component in testing tools (e.g.: cypress, testing library, and jest).
   *
   * @default 'store-slider'
   */
  testId?: string
  /**
   * Callback that fires when the slider value changes.
   */
  onChange?: (value: { min: number; max: number }) => void
  /**
   * Set a human-readable name for the slider.
   */
  ariaLabel?: string
  /**
   * A function used to set a human-readable value text based on the slider's current value.
   */
  getAriaValueText?(value: number, thumb?: 'min' | 'max'): string
}

const Slider = ({
  min,
  max,
  onChange,
  testId = 'store-slider',
  showValues = true,
  ariaLabel,
  getAriaValueText,
}: SliderProps) => {
  const [minVal, setMinVal] = useState(min)
  const [maxVal, setMaxVal] = useState(max)

  const minValRef = useRef(min)
  const maxValRef = useRef(max)
  const range = useRef<HTMLDivElement>(null)

  const getPercent = useCallback(
    (value) => Math.round(((value - min) / (max - min)) * 100),
    [min, max]
  )

  // width of the range to reduce from the left side
  useEffect(() => {
    const minPercent = getPercent(minVal)
    const maxPercent = getPercent(maxValRef.current)

    if (range.current) {
      range.current.style.left = `${minPercent}%`
      range.current.style.width = `${maxPercent - minPercent}%`
    }
  }, [minVal, getPercent])

  // width of the range to reduce from the right side
  useEffect(() => {
    const minPercent = getPercent(minValRef.current)
    const maxPercent = getPercent(maxVal)

    if (range.current) {
      range.current.style.width = `${maxPercent - minPercent}%`
    }
  }, [maxVal, getPercent])

  useEffect(() => {
    onChange?.({ min: minVal, max: maxVal })
  }, [minVal, maxVal, onChange])

  return (
    <div
      data-store-slider
      data-testid={testId}
      aria-label={ariaLabel}
      // eslint-disable-next-line jsx-a11y/role-has-required-aria-props
      role="slider"
    >
      <div data-store-slider-range>
        <div ref={range} data-store-slider-track />
        <input
          type="range"
          min={min}
          max={max}
          value={minVal}
          onChange={(event) => {
            const value = Math.min(Number(event.target.value), maxVal - 1)

            setMinVal(value)
            minValRef.current = value
          }}
          data-store-slider-thumb="left"
          style={{ zIndex: minVal > max - 100 ? 5 : 'auto' }}
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={minVal}
          aria-label={String(minVal)}
          aria-labelledby={
            getAriaValueText ? getAriaValueText(minVal, 'min') : undefined
          }
        />
        <input
          type="range"
          min={min}
          max={max}
          value={maxVal}
          onChange={(event) => {
            const value = Math.max(Number(event.target.value), minVal + 1)

            setMaxVal(value)
            maxValRef.current = value
          }}
          data-store-slider-thumb="right"
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={maxVal}
          aria-label={String(maxVal)}
          aria-labelledby={
            getAriaValueText ? getAriaValueText(maxVal, 'max') : undefined
          }
        />
      </div>
      {showValues && (
        <div data-store-slider-values>
          <div data-store-slider-value="min">{minVal}</div>
          <div data-store-slider-value="max">{maxVal}</div>
        </div>
      )}
    </div>
  )
}

export default Slider
