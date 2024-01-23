import type { ChangeEvent, FocusEvent, KeyboardEvent } from 'react'
import React, { useEffect, useState } from 'react'
import { Button } from 'ariakit'
import cn from 'classnames'

export type QuantityButtonProps = {
  Icon: React.ComponentType
  onClick: React.ComponentProps<typeof Button>['onClick']
  disabled?: React.ComponentProps<typeof Button>['disabled']
  testId?: string
}

const QuantityButton = ({
  Icon,
  onClick,
  disabled,
  testId,
}: QuantityButtonProps) => (
  <Button
    className={cn(
      'z-2 relative flex h-7 w-7 items-center justify-center rounded-full md:h-8 md:w-8',
      {
        'bg-brand-secondary text-brand-primary': !disabled,
        'bg-gray-100 text-gray-400': disabled,
      }
    )}
    aria-hidden={true}
    data-testid={testId}
    tabIndex={-1}
    onClick={onClick}
    disabled={disabled}
  >
    <Icon />
  </Button>
)

const MinusIcon = () => (
  <svg
    width="12"
    height="4"
    viewBox="0 0 12 4"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M0.75 0.950195H11.25V3.0502H0.75V0.950195Z" fill="currentcolor" />
  </svg>
)

const PlusIcon = () => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 12 12"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M7.05469 0.74707H4.9541V4.94824H0.75V7.04883H4.9541V11.2471H7.05469V7.04883H11.25V4.9541H7.05469V0.74707Z"
      fill="currentcolor"
    />
  </svg>
)

/** Converts strings to numbers, or just returns the input if it is already a number.
 * parseFloat would accept numbers just fine, this is mostly to calm Typescript down
 * (but also seems more sane to me tbh https://github.com/microsoft/TypeScript/issues/17203) */
const parseNumber = (value: string | number) =>
  typeof value === 'number' ? value : Number.parseFloat(value)

/** Validates the input as the user types. Allows for empty strings, but
 * restricts it to numeric values smaller than `max`. (Restricting to > min
 * causes issues when, for example, the user is typing 12 but the min is 2)
 */
const useDisplayQuantity = (quantity: number, max: number) => {
  const [displayQuantity, setDisplayQuantity] = useState(String(quantity))

  const updateDisplayQuantity = (value: string | number) => {
    const parsedQuantity = parseNumber(value)

    if (Number.isNaN(parsedQuantity)) {
      setDisplayQuantity('')

      return
    }

    setDisplayQuantity(String(Math.min(max, parsedQuantity)))
  }

  // Updates the displayQuantity state when the quantity prop changes
  useEffect(() => {
    setDisplayQuantity(String(quantity))
  }, [setDisplayQuantity, quantity])

  return {
    displayQuantity,
    setDisplayQuantity: updateDisplayQuantity,
  }
}

export type QuantitySelectorProps = {
  quantity?: number
  min?: number
  max?: number
  label: string
  onChange?: (quantity: number) => void
}

export const QuantitySelector = ({
  quantity = 1,
  min = 0,
  max = Infinity,
  label,
  onChange,
}: QuantitySelectorProps) => {
  const { displayQuantity, setDisplayQuantity } = useDisplayQuantity(
    quantity,
    max
  )

  const [isGreaterThanMax, setGreaterThanMax] = useState(false)
  const [isSmallerThanMin, setSmallerThanMin] = useState(false)

  const [focused, setFocused] = useState(false)

  if (!label) {
    console.error(
      '[QuantitySelector] The `label` prop is mandatory for accessibility'
    )

    return <div />
  }

  if (min < 0) {
    console.error(
      `[QuantitySelector] This component doesn't support 'min' as a negative value. min='${min}'`
    )

    return <div />
  }

  const normalizeQuantity = (value: number | string) => {
    const parsedQuantity = parseNumber(value)

    if (Number.isNaN(parsedQuantity)) {
      return min
    }

    return Math.max(min, Math.min(max, parsedQuantity))
  }

  const handleSubmit = (value: string | number) => {
    const parsedValue = parseNumber(value)

    const normalizedQuantity = normalizeQuantity(value)

    if (parsedValue < normalizedQuantity) {
      setSmallerThanMin(true)
    }

    setDisplayQuantity(quantity)

    if (quantity !== normalizedQuantity) {
      onChange?.(normalizedQuantity)
    }
  }

  const handleInputFocus = (event: FocusEvent<HTMLInputElement>) => {
    event.target.select()

    setFocused(true)
  }

  const handleInputBlur = () => {
    setGreaterThanMax(false)
    handleSubmit(displayQuantity)
    setFocused(false)
  }

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target

    setSmallerThanMin(false)
    setDisplayQuantity(value)
    setGreaterThanMax(parseNumber(value) > max)
  }

  const handleDecrease = () => handleSubmit(quantity - 1)
  const handleIncrease = () => handleSubmit(quantity + 1)

  const handleKeyPress = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault()
      handleSubmit(displayQuantity)
    }
  }

  const handleUndo = () => {
    setDisplayQuantity(quantity)
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      handleUndo()
    }
  }

  const normalizedDisplayQuantity = normalizeQuantity(displayQuantity)
  const isMin = normalizedDisplayQuantity <= min
  const isMax = normalizedDisplayQuantity >= max
  const hasMax = max !== Infinity
  const isEmpty = displayQuantity === ''

  return (
    <div className="w-26 flex items-center justify-between md:w-32">
      <QuantityButton
        Icon={MinusIcon}
        onClick={handleDecrease}
        disabled={isMin}
        testId="QuantitySelectorDecrease"
      />
      <input
        className="text-text-secondary w-12 text-center font-semibold"
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        value={focused ? displayQuantity : quantity}
        onChange={handleInputChange}
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
        onKeyPress={handleKeyPress}
        onKeyDown={handleKeyDown}
        role="spinbutton"
        aria-valuemin={min}
        {...(hasMax && {
          'aria-valuemax': max,
        })}
        aria-valuenow={normalizeQuantity(displayQuantity)}
        aria-label={label}
      />
      <span role="alert" className="sr-only">
        {isGreaterThanMax && <>A quantidade máxima para este item é {max}</>}
        {isSmallerThanMin && <>A quantidade mínima para este item é {min}</>}
        {isEmpty && <>O campo está vazio</>}
      </span>
      <QuantityButton
        Icon={PlusIcon}
        onClick={handleIncrease}
        disabled={isMax}
        testId="QuantitySelectorIncrease"
      />
    </div>
  )
}
