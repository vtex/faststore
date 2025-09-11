import { InputField } from '@vtex/faststore-ui'
import { type Ref, useImperativeHandle, useRef, useState } from 'react'

export interface MyAccountFilterFacetDateRangeProps {
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
  /**
   * Component ref
   */
  ref?: Ref<MyAccountFilterFacetDateRangeRef>
}

interface MyAccountFilterFacetDateRangeRef {
  clear: () => void
  getDataRangeFacet: () => {
    key: string
    value: { from: string; to: string }
  }
}

export default function MyAccountFilterFacetDateRange({
  to,
  from,
  setDisabled,
  ref,
}: MyAccountFilterFacetDateRangeProps) {
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
      setInputFromError('Invalid date range')
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
    <div data-fs-list-orders-filters-date-range>
      <div data-fs-list-orders-filters-date-range-inputs>
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
}
