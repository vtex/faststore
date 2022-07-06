/**
 * This code is inspired by the work of [sandra-lewis](https://codesandbox.io/u/sandra-lewis)
 */
import React, {
  useState,
  useMemo,
  useImperativeHandle,
  forwardRef,
} from 'react'

interface Range {
  absolute: number
  selected: number
}

export type SliderProps = {
  /**
   * The minimum value of the slider.
   */
  min: Range
  /**
   * The maximum value of the slider.
   */
  max: Range
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
   * Callback that fires when the slider value ends changing.
   */
  onEnd?: (value: { min: number; max: number }) => void
  /**
   * A function used to set a human-readable value text based on the slider's current value.
   */
  getAriaValueText?(value: number, thumb?: 'min' | 'max'): string
  /**
   * Returns the value of element's class content attribute.
   */
  className?: string
}

type SliderRefType = {
  setSliderValues: (values: { min: number; max: number }) => void
}

const percent = (value: number, min: number, max: number) =>
  Math.round(((value - min) / (max - min)) * 100)

const Slider = forwardRef<SliderRefType | undefined, SliderProps>(
  function Slider(
    {
      min,
      max,
      onChange,
      onEnd,
      testId = 'store-slider',
      getAriaValueText,
      className,
    },
    ref
  ) {
    const [minPercent, setMinPercent] = useState(() =>
      percent(min.selected, min.absolute, max.absolute)
    )

    const [maxPercent, setMaxPercent] = useState(() =>
      percent(max.selected, min.absolute, max.absolute)
    )

    const { minVal, maxVal } = useMemo(() => {
      const widthPercent = (max.absolute - min.absolute) / 100

      return {
        minVal: min.absolute + minPercent * widthPercent,
        maxVal: min.absolute + maxPercent * widthPercent,
      }
    }, [min, max, maxPercent, minPercent])

    useImperativeHandle(ref, () => ({
      setSliderValues: (values: { min: number; max: number }) => {
        const sliderMinValue = Math.min(Number(values.min), maxVal)
        const sliderMaxValue = Math.max(Number(values.max), minVal)

        setMinPercent(percent(sliderMinValue, min.absolute, max.absolute))
        setMaxPercent(percent(sliderMaxValue, min.absolute, max.absolute))
      },
    }))

    return (
      <div data-store-slider data-testid={testId} className={className}>
        <div
          style={{
            left: `${minPercent}%`,
            width: `${maxPercent - minPercent}%`,
          }}
          data-slider-range
        />
        <input
          type="range"
          min={min.absolute}
          max={max.absolute}
          value={minVal}
          onMouseUp={() => onEnd?.({ min: minVal, max: maxVal })}
          onTouchEnd={() => onEnd?.({ min: minVal, max: maxVal })}
          onChange={(event) => {
            const minValue = Math.min(Number(event.target.value), maxVal)

            setMinPercent(percent(minValue, min.absolute, max.absolute))
            onChange?.({ min: minValue, max: maxVal })
          }}
          data-slider-thumb="left"
          aria-valuemin={min.absolute}
          aria-valuemax={max.absolute}
          aria-valuenow={minVal}
          aria-label={String(minVal)}
          aria-labelledby={getAriaValueText?.(minVal, 'min')}
        />
        <input
          type="range"
          min={min.absolute}
          max={max.absolute}
          value={maxVal}
          onMouseUp={() => onEnd?.({ min: minVal, max: maxVal })}
          onTouchEnd={() => onEnd?.({ min: minVal, max: maxVal })}
          onChange={(event) => {
            const maxValue = Math.max(Number(event.target.value), minVal)

            setMaxPercent(percent(maxValue, min.absolute, max.absolute))
            onChange?.({ min: minVal, max: maxValue })
          }}
          data-slider-thumb="right"
          aria-valuemin={min.absolute}
          aria-valuemax={max.absolute}
          aria-valuenow={maxVal}
          aria-label={String(maxVal)}
          aria-labelledby={getAriaValueText?.(maxVal, 'max')}
        />
      </div>
    )
  }
)

export default Slider
