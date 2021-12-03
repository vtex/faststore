import type { InputHTMLAttributes, ReactNode } from 'react'
import React, { forwardRef } from 'react'

import IconButton from '../IconButton'
import { useQuantitySelector } from './useQuantitySelector'

export interface QuantitySelectorButtonProps
  extends Omit<InputHTMLAttributes<HTMLButtonElement>, 'type'> {
  /**
   * ID to find this component in testing tools (e.g.: cypress, testing library, and jest).
   *
   * @default 'store-quantity-selector-button'
   */
  testId?: string

  icon: ReactNode
}

const QuantitySelectorButton = forwardRef<
  HTMLButtonElement,
  QuantitySelectorButtonProps
>(function QuantitySelectorButton(
  { children, testId = 'store-quantity-selector-button', icon, ...otherProps },
  ref
) {
  const { name, onClick } = useQuantitySelector()

  return (
    <IconButton
      data-store-quantity-selector-button
      icon={icon}
      name={name}
      onClick={onClick}
      ref={ref}
      testId={testId}
      {...otherProps}
    />
  )
})

export default QuantitySelectorButton
