import React, { useCallback, useEffect, useRef, useState } from 'react'

export type SliderProps = {
  min: number
  max: number
  showValues?: boolean
  /**
   * ID to find this component in testing tools (e.g.: cypress, testing library, and jest).
   */
  testId?: string
  onChange?: (value: { min: number; max: number }) => void
}

const Slider = ({
  min,
  max,
  onChange,
  testId = 'store-slider',
  showValues = true,
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

  useEffect(() => {
    const minPercent = getPercent(minVal)
    const maxPercent = getPercent(maxValRef.current)

    if (range.current) {
      range.current.style.left = `${minPercent}%`
      range.current.style.width = `${maxPercent - minPercent}%`
    }
  }, [minVal, getPercent])

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
    <div data-store-slider data-testid={testId}>
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
