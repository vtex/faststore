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
   * Specifies that the whole quantity selector component should be disabled.
   */
  disabled?: boolean
  /**
   * Event emitted when value is changed
   */
  onChange?: (value: number) => void
}

const QuantitySelector = ({
  max,
  min = 1,
  initial,
  disabled = false,
  onChange,
  testId = 'fs-quantity-selector',
  ...otherProps
}: QuantitySelectorProps) => {
  const [quantity, setQuantity] = useState<number>(initial ?? min)

  const isLeftDisabled = quantity === min
  const isRightDisabled = quantity === max

  const changeQuantity = (increaseValue: number) => {
    const quantityValue = validateQuantityBounds(quantity + increaseValue)

    onChange?.(quantityValue)
    setQuantity(quantityValue)
  }

  const increase = () => changeQuantity(1)

  const decrease = () => changeQuantity(-1)

  function validateQuantityBounds(n: number): number {
    const maxValue = min ? Math.max(n, min) : n

    return max ? Math.min(maxValue, max) : maxValue
  }

  function validateInput(e: React.FormEvent<HTMLInputElement>) {
    const val = e.currentTarget.value

    if (!Number.isNaN(Number(val))) {
      setQuantity(() => {
        const quantityValue = validateQuantityBounds(Number(val))

        onChange?.(quantityValue)

        return quantityValue
      })
    }
  }

  useEffect(() => {
    initial && setQuantity(initial)
  }, [initial])

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
        value={quantity}
        onChange={validateInput}
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
