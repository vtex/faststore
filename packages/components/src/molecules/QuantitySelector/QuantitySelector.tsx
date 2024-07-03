import React, { useEffect, useState } from 'react'

import { Icon, IconButton, Input } from '../../'

export interface QuantitySelectorProps {
  /**
   * ID to find this component in testing tools (e.g.: cypress, testing library, and jest).
   *
   * @default 'fs-quantity-selector'
   */
  testId?: string
  /**
   * The maximum value the quantity selector can receive
   */
  max?: number
  /**
   * The minimum value the quantity selector can receive
   */
  min?: number
  /**
   * The initial value for quantity selector
   */
  initial?: number
  /**
   * Controls by how many units the value advances
   */
  unitMultiplier?: number
  /**
   * Controls wheter you use or not the unitMultiplier
   */
  useUnitMultiplier?: boolean
  /**
   * Specifies that the whole quantity selector component should be disabled.
   */
  disabled?: boolean
  /**
   * Event emitted when value is changed
   */
  onChange?: (value: number) => void
  /**
   * Event emitted when value is out of the min and max bounds
   */
  onValidateBlur?: (min: number, maxValue: number, quantity: number) => void
}

const QuantitySelector = ({
  max,
  min = 1,
  unitMultiplier = 1,
  useUnitMultiplier,
  initial,
  disabled = false,
  onChange,
  onValidateBlur,
  testId = 'fs-quantity-selector',
  ...otherProps
}: QuantitySelectorProps) => {
  const [quantity, setQuantity] = useState<number>(initial ?? min)
  const [multipliedUnit, setMultipliedUnit] = useState<number>(
    quantity * unitMultiplier
  )

  const roundUpQuantityIfNeeded = (quantity: number) => {
    if (!useUnitMultiplier) {
      return quantity
    }
    return Math.ceil(quantity / unitMultiplier) * unitMultiplier
  }

  const isLeftDisabled = quantity === min
  const isRightDisabled = quantity === max

  const changeQuantity = (increaseValue: number) => {
    const quantityValue = validateQuantityBounds(quantity + increaseValue)

    onChange?.(quantityValue)
    setQuantity(quantityValue)
    setMultipliedUnit(quantityValue * unitMultiplier)
  }

  const increase = () => changeQuantity(1)

  const decrease = () => changeQuantity(-1)

  function validateQuantityBounds(n: number): number {
    const maxValue = min ? Math.max(n, min) : n

    return max
      ? Math.min(maxValue, useUnitMultiplier ? max * unitMultiplier : max)
      : maxValue
  }

  function validateBlur() {
    const quantityValue = validateQuantityBounds(quantity)
    const roundedQuantity = roundUpQuantityIfNeeded(quantityValue)

    const maxValue = max ?? (min ? Math.max(quantity, min) : quantity)
    const isOutOfBounds = quantity > maxValue || quantity < min
    if (isOutOfBounds) {
      onValidateBlur?.(min, maxValue, roundedQuantity)
    }

    setQuantity(() => {
      setMultipliedUnit(roundedQuantity)
      onChange?.(roundedQuantity / unitMultiplier)

      return roundedQuantity / unitMultiplier
    })
  }

  useEffect(() => {
    initial && setQuantity(initial)
  }, [initial])

  const changeValueInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuantity(Number(e.currentTarget.value))
  }

  return (
    <div
      data-fs-quantity-selector={disabled ? 'disabled' : 'true'}
      data-testid={testId}
      {...otherProps}
    >
      <IconButton
        data-quantity-selector-button="left"
        icon={<Icon name="Minus" width={16} height={16} weight="bold" />}
        aria-label="Decrement Quantity"
        aria-controls="quantity-selector-input"
        disabled={isLeftDisabled || disabled}
        onClick={decrease}
        testId={`${testId}-left-button`}
        size="small"
      />
      <Input
        data-quantity-selector-input
        id="quantity-selector-input"
        aria-label="Quantity"
        value={useUnitMultiplier ? multipliedUnit : quantity}
        onChange={changeValueInput}
        onBlur={validateBlur}
        disabled={disabled}
      />
      <IconButton
        data-quantity-selector-button="right"
        aria-controls="quantity-selector-input"
        aria-label="Increment Quantity"
        disabled={isRightDisabled || disabled}
        icon={<Icon name="Plus" width={16} height={16} weight="bold" />}
        onClick={increase}
        testId={`${testId}-right-button`}
        size="small"
      />
    </div>
  )
}

export default QuantitySelector
