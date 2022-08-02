import { useState, useRef } from 'react'
import { PriceRange as UIPriceRange } from '@faststore/ui'
import type { PriceRangeProps } from '@faststore/ui'

import {
  usePriceFormatter,
  useFormattedPrice,
} from 'src/sdk/product/useFormattedPrice'

import styles from './price-range.module.scss'
import InputText from '../InputText'

type Props = Omit<
  PriceRangeProps,
  'formatter' | 'minValueLabelComponent' | 'maxValueLabelComponent'
>

function PriceRange({ min, max, onEnd, step = 10, ...otherProps }: Props) {
  const formatter = usePriceFormatter({ decimals: false })
  const minAbsoluteFormatted = useFormattedPrice(Math.round(min.absolute))
  const maxAbsoluteFormatted = useFormattedPrice(Math.ceil(max.absolute))

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
  }

  return (
    <div className={styles.fsPriceRange} data-fs-price-range>
      <div data-fs-price-range-absolute-values>
        <span>{minAbsoluteFormatted}</span>
        <span>{maxAbsoluteFormatted}</span>
      </div>
      <UIPriceRange
        ref={priceRangeRef}
        min={min}
        max={max}
        formatter={formatter}
        className={styles.fsPriceRange}
        onEnd={(value) => {
          onEnd?.(value)
          onChangePriceRange(value)
        }}
        {...otherProps}
      />
      <div data-fs-price-range-inputs>
        <InputText
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
        <InputText
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

export default PriceRange
