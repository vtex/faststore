import React, { useState, Fragment, FC } from 'react'
import { Select, Input } from '@vtex/store-ui'

const MAX_INPUT_LENGTH = 5

const SELECTOR_DROPDOWN = 'DROPDOWN'
const SELECTOR_INPUT = 'INPUT'

interface Props {
  id: string
  value: number
  maxValue: number
  onChange: (value: number) => void
  disabled: boolean
}

const normalizeValue = (value: number, maxValue: number) =>
  value > maxValue ? maxValue : value

const validateValue = (value: string, maxValue: number) => {
  const parsedValue = parseInt(value, 10)

  if (Number.isNaN(parsedValue)) {
    return 1
  }

  return normalizeValue(parseInt(value, 10), maxValue)
}

const validateDisplayValue = (value: string, maxValue: number) => {
  const parsedValue = parseInt(value, 10)

  if (Number.isNaN(parsedValue) || parsedValue < 0) {
    return ''
  }

  return `${normalizeValue(parsedValue, maxValue)}`
}

const getDropdownOptions = (maxValue: number) => {
  const limit = Math.min(9, maxValue)
  const options = [{ value: 0, label: `0 - Remove` }]

  for (let idx = 1; idx <= limit; idx++) {
    options.push({
      value: idx,
      label: idx.toString(),
    })
  }

  if (maxValue >= 10) {
    options.push({ value: 10, label: '10+' })
  }

  return options
}

export const QuantitySelector: FC<Props> = ({
  id,
  value,
  maxValue,
  onChange,
  disabled,
}) => {
  const [curSelector, setSelector] = useState(
    value < 10 ? SELECTOR_DROPDOWN : SELECTOR_INPUT
  )

  const [activeInput, setActiveInput] = useState(false)

  const normalizedValue = normalizeValue(value, maxValue)

  const [curDisplayValue, setDisplayValue] = useState(`${normalizedValue}`)

  const handleDropdownChange = (newValue: string) => {
    const validatedValue = validateValue(newValue, maxValue)
    const displayValue = validateDisplayValue(newValue, maxValue)

    if (validatedValue >= 10 && curSelector === SELECTOR_DROPDOWN) {
      setSelector(SELECTOR_INPUT)
    }

    setDisplayValue(displayValue)
    onChange(validatedValue)
  }

  const handleInputChange = (newValue: string) => {
    const displayValue = validateDisplayValue(newValue, maxValue)

    setDisplayValue(displayValue)
  }

  const handleInputBlur = () => {
    setActiveInput(false)
    if (curDisplayValue === '') {
      setDisplayValue('1')
    }

    const validatedValue = validateValue(curDisplayValue, maxValue)

    onChange(validatedValue)
  }

  const handleInputFocus = () => setActiveInput(true)

  if (
    !activeInput &&
    normalizedValue !== validateValue(curDisplayValue, maxValue)
  ) {
    if (normalizedValue >= 10) {
      setSelector(SELECTOR_INPUT)
    }

    setDisplayValue(validateDisplayValue(`${normalizedValue}`, maxValue))
  }

  if (curSelector === SELECTOR_DROPDOWN) {
    const dropdownOptions = getDropdownOptions(maxValue)

    return (
      <Fragment>
        <Select
          id={`quantity-dropdown-mobile-${id}`}
          data-test-id={`quantity-dropdown-mobile-${id}`}
          value={normalizedValue}
          onChange={(event: any) => handleDropdownChange(event.target.value)}
          placeholder=""
          disabled={disabled}
        >
          {dropdownOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </Select>
      </Fragment>
    )
  }

  return (
    <Fragment>
      <Input
        id={`quantity-input-mobile-${id}`}
        value={curDisplayValue}
        maxLength={MAX_INPUT_LENGTH}
        onChange={(event: any) => handleInputChange(event.target.value)}
        onBlur={handleInputBlur}
        onFocus={handleInputFocus}
        placeholder=""
        disabled={disabled}
      />
    </Fragment>
  )
}
