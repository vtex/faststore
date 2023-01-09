import React, { useState, useEffect } from 'react'

import type { IconButtonProps, InputProps } from '../../index'
import { IconButton, Input } from '../../index'
import { Minus, Plus } from '../../assets'

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
  /**
   * Object with properties that will be passed forward the inner IconButton atom at the left of the input.
   */
  leftButtonProps: Omit<IconButtonProps, 'aria-label'>
  /**
   * Object with properties that will be passed forward the inner Input atom between the two buttons.
   */
  inputProps: InputProps
  /**
   * Object with properties that will be passed forward the inner IconButton atom at the right of the input.
   */
  rightButtonProps: Omit<IconButtonProps, 'aria-label'>
}

const QuantitySelector = ({
  max,
  min = 1,
  initial,
  disabled = false,
  onChange,
  testId = 'fs-quantity-selector',
  leftButtonProps,
  inputProps,
  rightButtonProps,
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
        icon={<Minus />}
        aria-label="Decrement Quantity"
        aria-controls="quantity-selector-input"
        disabled={isLeftDisabled || disabled}
        onClick={decrease}
        testId={`${testId}-left-button`}
      />
      <Input
        data-quantity-selector-input
        id="quantity-selector-input"
        aria-label="Quantity"
        value={quantity}
        onChange={() => onChange}
        {...inputProps}
      />
      <IconButton
        data-quantity-selector-button="right"
        aria-controls="quantity-selector-input"
        aria-label="Increment Quantity"
        disabled={isRightDisabled || disabled}
        icon={<Plus />}
        onClick={increase}
        testId={`${testId}-right-button`}
      />
    </div>
  )
}

export default QuantitySelector
