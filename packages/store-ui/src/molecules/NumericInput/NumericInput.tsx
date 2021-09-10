import React, { useCallback, useEffect, useState } from 'react'
import type { PropsWithChildren } from 'react'

import Button from '../../atoms/Button'
import Input from '../../atoms/Input'

interface ActionButtonProps {
  actionOption: 'dec' | 'inc'
  disabled: boolean
  ariaLabel: string
  onClick: (currentValue: number) => void
}

const ActionButton = ({
  children,
  actionOption,
  disabled,
  ariaLabel,
  onClick,
}: PropsWithChildren<ActionButtonProps>) => (
  <Button
    type="button"
    data-store-button={actionOption}
    onClick={(event) => onClick(parseInt(event.currentTarget.value, 10))}
    disabled={disabled}
    aria-label={ariaLabel}
    aria-disabled="false"
  >
    {children}
  </Button>
)

export interface NumericInputProps {
  /**
   * The initial value of the input. Should be less than max and greater then min.
   */
  defaultValue?: number
  /**
   * The minimum value of the input. When the input value reaches the minimum, the decrease's button is disabled.
   */
  min?: number
  /**
   * The maximum value of the input. When the input value reaches the maximum, the increase's button is disabled.
   */
  max?: number
  /**
   * Define if the component is disabled.
   */
  disabled?: boolean
  /**
   * Callback that fires when the current value changes, either by directly changing the input or by buttons' action.
   */
  onChange?: (value: number) => void
  /**
   * ID to find this component in testing tools (e.g.: cypress, testing library, and jest).
   *
   * @default 'store-numeric-input'
   */
  testId?: string
}

const NumericInput = ({
  defaultValue,
  min = -Infinity,
  max = Infinity,
  disabled = false,
  testId = 'store-numeric-input',
  onChange,
}: NumericInputProps) => {
  const initialValue =
    defaultValue && defaultValue >= min && defaultValue <= max
      ? defaultValue
      : min !== -Infinity
      ? min
      : 0

  const [currentValue, setCurrentValue] = useState(initialValue)
  const [buttonDisabled, setButtonDisabled] = useState<{
    dec: boolean
    inc: boolean
  }>()

  const handleCurrentValueUpdate = useCallback(
    (newValue: number) => {
      setCurrentValue(newValue)
      onChange?.(newValue)
    },
    [onChange]
  )

  const handleInputChange = useCallback(
    (event: React.FormEvent<HTMLInputElement>) => {
      if (disabled) return

      const inputValue = event.currentTarget.value

      if (inputValue === '') handleCurrentValueUpdate(initialValue)
      else handleCurrentValueUpdate(parseInt(inputValue, 10))
    },
    [disabled, initialValue, handleCurrentValueUpdate]
  )

  const handleActionButtonClick = useCallback(
    (actionOption: 'dec' | 'inc') => {
      if (currentValue < min) handleCurrentValueUpdate(min)
      else if (currentValue > max) handleCurrentValueUpdate(max)
      else {
        const newValue =
          actionOption === 'dec' ? currentValue - 1 : currentValue + 1

        handleCurrentValueUpdate(newValue)
      }
    },
    [currentValue, max, min, handleCurrentValueUpdate]
  )

  useEffect(() => {
    setButtonDisabled({
      dec: currentValue <= min || disabled,
      inc: currentValue >= max || disabled,
    })
  }, [currentValue, disabled, min, max])

  return (
    <div
      data-store-numeric-input
      data-testid={testId}
      aria-label="number-input"
    >
      <ActionButton
        actionOption="dec"
        disabled={buttonDisabled?.dec ?? false}
        onClick={() => handleActionButtonClick('dec')}
        ariaLabel="Decrease current value"
      >
        <span aria-hidden="true">-</span>
      </ActionButton>
      <Input
        type="number"
        value={currentValue}
        onChange={handleInputChange}
        min={min}
        max={max}
        defaultValue={defaultValue}
        variant={currentValue < min || currentValue > max ? 'error' : undefined}
        disabled={disabled}
        role="spinbutton"
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={currentValue}
      />
      <ActionButton
        actionOption="inc"
        disabled={buttonDisabled?.inc ?? false}
        onClick={() => handleActionButtonClick('inc')}
        ariaLabel="Increase current value"
      >
        <span aria-hidden="true">+</span>
      </ActionButton>
    </div>
  )
}

export default NumericInput
