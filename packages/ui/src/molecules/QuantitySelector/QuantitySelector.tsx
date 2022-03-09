import type { InputHTMLAttributes } from 'react'
import React, { forwardRef } from 'react'

import type { InputProps } from '../../atoms/Input'
import Input from '../../atoms/Input'
import type { IconButtonProps } from '../IconButton'
import IconButton from '../IconButton'

export interface QuantitySelectorProps
  extends InputHTMLAttributes<HTMLDivElement> {
  /**
   * Sets the current value that should be displayed on the input at the center of the quantity selector.
   */
  quantity: number | string

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

  /**
   * ID to find this component in testing tools (e.g.: cypress, testing library, and jest).
   *
   * @default 'store-quantity-selector'
   */
  testId?: string
}

const QuantitySelector = forwardRef<HTMLDivElement, QuantitySelectorProps>(
  function QuantitySelector(
    {
      quantity,
      testId = 'store-quantity-selector',
      leftButtonProps,
      inputProps,
      rightButtonProps,
      ...otherProps
    }: QuantitySelectorProps,
    ref
  ) {
    return (
      <div
        data-store-quantity-selector
        data-testid={testId}
        ref={ref}
        {...otherProps}
      >
        <IconButton
          aria-controls="quantity-selector-input"
          aria-label="Decrement Quantity"
          data-quantity-selector-button="left"
          {...leftButtonProps}
        />
        <Input
          aria-label="Quantity"
          data-quantity-selector-input
          id="quantity-selector-input"
          value={quantity}
          {...inputProps}
        />
        <IconButton
          aria-controls="quantity-selector-input"
          aria-label="Increment Quantity"
          data-quantity-selector-button="right"
          {...rightButtonProps}
        />
      </div>
    )
  }
)

export default QuantitySelector
