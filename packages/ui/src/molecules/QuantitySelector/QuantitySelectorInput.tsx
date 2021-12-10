import type { InputHTMLAttributes } from 'react'
import React, { forwardRef } from 'react'

import Input from '../../atoms/Input'
import { useQuantitySelector } from './useQuantitySelector'

export interface QuantitySelectorInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  /**
   * ID to find this component in testing tools (e.g.: cypress, testing library, and jest).
   *
   * @default 'store-quantity-selector-input'
   */
  testId?: string
}

const QuantitySelectorInput = forwardRef<
  HTMLInputElement,
  QuantitySelectorInputProps
>(function QuantitySelectorInput(
  { children, testId = 'store-quantity-selector-input', ...otherProps },
  ref
) {
  const { name, currentValue } = useQuantitySelector()

  return (
    <Input
      data-store-quantity-selector-input
      name={name}
      ref={ref}
      role="spinbutton"
      testId={testId}
      value={currentValue}
      aria-label="Quantity Selector"
      {...otherProps}
    />
  )
})

export default QuantitySelectorInput
