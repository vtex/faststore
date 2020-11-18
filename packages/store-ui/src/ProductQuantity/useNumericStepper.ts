import { useCallback, useState, FocusEvent, ChangeEvent } from 'react'

interface Options {
  min?: number
  value: number
  max?: number
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
  const [value, setValue] = useState(narrow(initialValue, min, max))

  const narrowValue = useCallback(
    (e: FocusEvent<HTMLInputElement> | FocusEvent<HTMLSelectElement>) => {
      const inputValue = Number(e.target.value) ?? min
      const narrowed = narrow(inputValue, min, max)

      setValue(narrowed)
      raiseOnChange(narrowed)
    },
    [value, min, max]
  )

  const onChange = useCallback(
    (e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>) =>
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
