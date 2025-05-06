import { InputField } from '@faststore/ui'
import { forwardRef, useImperativeHandle, useRef, useState } from 'react'

export interface FilterFacetDateRangeProps {
  /**
   * The from value of the Range Facet
   */
  from: string
  /**
   * The to value of the Range Facet
   */
  to: string
  /**
   * The function to be called when the date range changes
   */
  setDisabled: (disabled: boolean) => void
}

const FilterFacetDateRange = forwardRef<
  {
    clear: () => void
    getDataRangeFacet: () => {
      key: string
      value: { from: string; to: string }
    }
  },
  FilterFacetDateRangeProps
>(({ to, from, setDisabled }, ref) => {
  const inputFromRef = useRef<HTMLInputElement>(null)
  const inputToRef = useRef<HTMLInputElement>(null)
  const [inputFromError, setInputFromError] = useState<string>()
  const [inputToError, setInputToError] = useState<string>()

  const [dateRange, setDateRange] = useState<{ from: string; to: string }>({
    from,
    to,
  })

  function onEnd(value: { from: string; to: string }) {
    if (!value.from || !value.to) {
      setInputFromError(undefined)
      setInputToError(undefined)
      setDisabled(false)
      return
    }

    if (new Date(value.from) > new Date(value.to)) {
      setInputFromError('From date cannot be greater than To date')
      setDisabled(true)
    } else {
      setInputFromError(undefined)
      setInputToError(undefined)
      setDisabled(false)
    }
  }

  function onChangeInputFrom(value: string) {
    setDateRange({ ...dateRange, from: String(value) })
    onEnd?.({ ...dateRange, from: String(value) })
  }

  function onChangeInputTo(value: string) {
    setDateRange({ ...dateRange, to: String(value) })
    onEnd?.({ ...dateRange, to: String(value) })
  }

  useImperativeHandle(ref, () => ({
    clear: () => {
      setInputFromError(undefined)
      setInputToError(undefined)
      setDateRange({ from: '', to: '' })
      if (inputFromRef.current) inputFromRef.current.value = ''
      if (inputToRef.current) inputToRef.current.value = ''
    },
    getDataRangeFacet: () => {
      return {
        key: 'dateRange',
        value: dateRange,
      }
    },
  }))

  return (
    <div data-fs-date-range>
      <div data-fs-date-range-inputs>
        <InputField
          id="date-range-from"
          label="From"
          type="date"
          inputMode="text"
          error={inputFromError}
          inputRef={inputFromRef}
          value={dateRange.from}
          onChange={(e) => onChangeInputFrom(e.target.value)}
          onBlur={() => !inputFromError && onEnd?.(dateRange)}
        />
        <InputField
          id="date-range-to"
          label="To"
          type="date"
          inputMode="text"
          error={inputToError}
          inputRef={inputToRef}
          value={dateRange.to}
          onChange={(e) => onChangeInputTo(e.target.value)}
          onBlur={() => !inputToError && onEnd?.(dateRange)}
        />
      </div>
    </div>
  )
})

export default FilterFacetDateRange
