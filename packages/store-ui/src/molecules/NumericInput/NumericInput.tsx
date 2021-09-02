import React, { useCallback, useState } from 'react'
import type { PropsWithChildren } from 'react'

import Button from '../../atoms/Button'
import Input from '../../atoms/Input'

interface ActionButtonProps {
  actionOption: 'dec' | 'inc'
  isDisabled: boolean
  testId: string
  onClick: (currentValue: number) => void
}

const ActionButton = ({
  actionOption,
  isDisabled,
  testId,
  onClick,
  children,
}: PropsWithChildren<ActionButtonProps>) => (
  <Button
    type="button"
    data-testid={`${testId}-${actionOption}`}
    data-numeric-input-action={actionOption}
    onClick={(event) => onClick(parseInt(event.currentTarget.value, 10))}
    aria-label={`numeric-input-${actionOption}`}
    disabled={isDisabled}
  >
    {children}
  </Button>
)

export interface NumericInputProps {
  /**
   * The current value of the input. Should be less than max and greater then min.
   */
  value?: number
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
   * Define if the input is disabled.
   */
  isDisabled?: boolean
  /**
   * Callback that fir
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
  value = 1,
  defaultValue,
  min = 0,
  max = Infinity,
  isDisabled = false,
  testId = 'store-numeric-input',
  onChange,
}: NumericInputProps) => {
  const [currentValue, setCurrentValue] = useState(value)
  const [isButtonDisabled, setIsButtonDisabled] = useState<{
    dec: boolean
    inc: boolean
  }>({ dec: isDisabled, inc: isDisabled })

  const handleInputChange = useCallback(
    (event: React.FormEvent<HTMLInputElement>) => {
      const inputValue = parseInt(event.currentTarget.value, 10)

      setCurrentValue(inputValue)
      onChange?.(inputValue)
    },
    [onChange]
  )

  const handleActionButtonClick = useCallback(
    (actionOption: 'dec' | 'inc') => {
      const newValue =
        actionOption === 'dec' ? currentValue - 1 : currentValue + 1

      if (newValue > min && newValue < max) {
        setCurrentValue(newValue)
        onChange?.(newValue)
      }

      setIsButtonDisabled({
        dec: newValue <= min,
        inc: newValue >= max,
      })
    },
    [currentValue, max, min, onChange]
  )

  return (
    <div
      data-store-numeric-input
      data-testid={testId}
      aria-label="numeric-input"
    >
      <ActionButton
        actionOption="dec"
        isDisabled={isButtonDisabled.dec}
        testId={testId}
        onClick={() => handleActionButtonClick('dec')}
      >
        <span>-</span>
      </ActionButton>
      <Input
        type="number"
        value={currentValue}
        onChange={handleInputChange}
        min={min}
        max={max}
        defaultValue={defaultValue}
        disabled={isDisabled}
      />
      <ActionButton
        actionOption="inc"
        isDisabled={isButtonDisabled.inc}
        testId={testId}
        onClick={() => handleActionButtonClick('inc')}
      >
        <span>+</span>
      </ActionButton>
    </div>
  )
}

export default NumericInput
