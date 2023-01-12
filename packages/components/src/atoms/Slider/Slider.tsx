/**
 * This code is inspired by the work of [sandra-lewis](https://codesandbox.io/u/sandra-lewis)
 */
import React, {
  useState,
  useMemo,
  useImperativeHandle,
  forwardRef,
} from 'react'
import type { ReactNode } from 'react'

interface Range {
  absolute: number
  selected: number
}

export type SliderProps = {
  /**
   * ID to find this component in testing tools (e.g.: cypress, testing library, and jest).
   *
   * @default 'fs-slider'
   */
  testId?: string
  /**
   * The minimum value of the slider.
   */
  min: Range
  /**
   * The maximum value of the slider.
   */
  max: Range
  /**
   * Specifies the number interval to be used in the inputs.
   */
  step?: number
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
  /**
   * Component that renders min value label above the left thumb.
   */
  minValueLabelComponent?: (minValue: number) => ReactNode
  /**
   * Component that renders max value label above the right thumb.
   */
  maxValueLabelComponent?: (maxValue: number) => ReactNode
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
      testId = 'fs-slider',
      getAriaValueText,
      className,
      step,
      minValueLabelComponent,
      maxValueLabelComponent,
    },
    ref
  ) {
    const widthPercent = useMemo(
      () => (max.absolute - min.absolute) / 100,
      [max.absolute, min.absolute]
    )
    const [minPercent, setMinPercent] = useState(() =>
      percent(min.selected, min.absolute, max.absolute)
    )

    const [maxPercent, setMaxPercent] = useState(() =>
      percent(max.selected, min.absolute, max.absolute)
    )

    const [minVal, setMinVal] = useState(() =>
      Math.round(min.absolute + minPercent * widthPercent)
    )
    const [maxVal, setMaxVal] = useState(() =>
      Math.round(min.absolute + maxPercent * widthPercent)
    )

    useImperativeHandle(ref, () => ({
      setSliderValues: (values: { min: number; max: number }) => {
        const sliderMinValue = Math.min(Number(values.min), maxVal)
        setMinVal(sliderMinValue)
        setMinPercent(percent(sliderMinValue, min.absolute, max.absolute))

        if (values.max > max.absolute) {
          setMaxVal(max.absolute)
          setMaxPercent(percent(max.absolute, min.absolute, max.absolute))
          return
        }

        const sliderMaxValue = Math.max(Number(values.max), minVal)
        setMaxVal(sliderMaxValue)
        setMaxPercent(percent(sliderMaxValue, min.absolute, max.absolute))
      },
    }))

    return (
      <div data-fs-slider data-testid={testId} className={className}>
        <div
          data-fs-slider-range
          style={{
            left: `${minPercent}%`,
            width: `${maxPercent - minPercent}%`,
          }}
        />
        <input
          type="range"
          min={Math.round(min.absolute)}
          max={Math.round(max.absolute)}
          value={minVal}
          step={step}
          onMouseUp={() => onEnd?.({ min: minVal, max: maxVal })}
          onTouchEnd={() => onEnd?.({ min: minVal, max: maxVal })}
          onChange={(event) => {
            const minValue = Math.min(Number(event.target.value), maxVal)

            setMinVal(minValue)
            setMinPercent(percent(minValue, min.absolute, max.absolute))
            onChange?.({ min: minValue, max: maxVal })
          }}
          data-fs-slider-thumb="left"
          aria-valuemin={min.absolute}
          aria-valuemax={max.absolute}
          aria-valuenow={minVal}
          aria-label={String(minVal)}
          aria-labelledby={getAriaValueText?.(minVal, 'min')}
        />
        {minValueLabelComponent && minValueLabelComponent(minVal)}
        <input
          type="range"
          min={Math.round(min.absolute)}
          max={Math.round(max.absolute)}
          value={maxVal}
          step={step}
          onMouseUp={() => onEnd?.({ min: minVal, max: maxVal })}
          onTouchEnd={() => onEnd?.({ min: minVal, max: maxVal })}
          onChange={(event) => {
            console.log(event)
            const maxValue = Math.max(Number(event.target.value), minVal)

            setMaxVal(maxValue)
            setMaxPercent(percent(maxValue, min.absolute, max.absolute))
            onChange?.({ min: minVal, max: maxValue })
          }}
          data-fs-slider-thumb="right"
          aria-valuemin={min.absolute}
          aria-valuemax={max.absolute}
          aria-valuenow={maxVal}
          aria-label={String(maxVal)}
          aria-labelledby={getAriaValueText?.(maxVal, 'max')}
        />
        {maxValueLabelComponent && maxValueLabelComponent(maxVal)}
      </div>
    )
  }
)

export default Slider
