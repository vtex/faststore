import { useCallback, useState } from 'react'
import type { FocusEvent, ChangeEvent } from 'react'

interface Options {
  value: number
  min: number
  max: number
  onChange: (quantity: number) => void
}

const narrow = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max)

export const useNumericStepper = ({
  value: initialValue,
  min = 0,
  max = Infinity,
  onChange: raiseOnChange,
}: Options) => {
  const [value, setValue] = useState(() => narrow(initialValue, min, max))

  const setAndRaise = useCallback(
    async (val: number) => {
      const narrowed = narrow(val, min, max)

      setValue(narrowed)
      raiseOnChange(narrowed)
    },
    [min, max, raiseOnChange]
  )

  const narrowValue = useCallback(
    (e: FocusEvent<HTMLInputElement> | FocusEvent<HTMLSelectElement>) =>
      setAndRaise(Number(e.target.value) ?? min),
    [min, setAndRaise]
  )

  const onChange = useCallback(
    (e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>) =>
      setValue(Number(e.target.value) ?? min),
    [min]
  )

  return {
    value: value.toString(),
    type: 'number',
    onChange,
    onBlur: narrowValue,
    onFocus: narrowValue,
    setValue: setAndRaise,
  }
}
