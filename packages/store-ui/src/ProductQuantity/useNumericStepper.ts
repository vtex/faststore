import { useCallback, useState, FocusEvent, ChangeEvent } from 'react'

interface Options {
  min?: number
  max?: number
  onChange: (quantity: number) => void
}

export const useNumericStepper = ({
  min = 0,
  max = Infinity,
  onChange: raiseOnChange,
}: Options) => {
  const [value, setValue] = useState(min)

  const narrowValue = useCallback(
    (e: FocusEvent<HTMLInputElement>) => {
      const inputValue = Number(e.target.value) ?? min
      const narrowed = Math.min(Math.max(inputValue, min), max)

      setValue(narrowed)
      raiseOnChange(narrowed)
    },
    [value, min, max]
  )

  const onChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) =>
      setValue(Number(e.target.value) ?? min),
    []
  )

  return {
    value: value.toString(),
    type: 'number',
    setValue,
    onChange,
    onBlur: narrowValue,
    onFocus: narrowValue,
  }
}
