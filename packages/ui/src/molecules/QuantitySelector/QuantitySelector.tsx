import type {
  AriaAttributes,
  ReactNode,
  InputHTMLAttributes,
  MouseEventHandler,
} from 'react'
import React from 'react'

import Input from '../../atoms/Input'
import IconButton from '../IconButton'
import { PlusIcon, MinusIcon } from './stories/assets/Icons'

export interface QuantitySelectorProps
  extends InputHTMLAttributes<HTMLInputElement> {
  /**
   * Returns the value of element's class content attribute.
   */
  className?: string
  /**
   * Sets the current value that should be displayed on the input at the center of the quantity selector.
   */
  quantity: number | string
  /**
   * Callback for handling the onClick event - triggered when the left IconButton of the quantity selector is pressed.
   */
  onClickLeft?: MouseEventHandler<HTMLButtonElement>
  /**
   * Callback for handling the onClick event - triggered when the right IconButton of the quantity selector is pressed.
   */
  onClickRight?: MouseEventHandler<HTMLButtonElement>
  /**
   * Sets the disabled state of the left IconButton of the quantity selector.
   */
  leftDisabled?: boolean
  /**
   * Sets the disabled state of the right IconButton of the quantity selector.
   */
  rightDisabled?: boolean
  /**
   * A React component that will be rendered in the IconButton at the left of the input.
   */
  leftIcon?: ReactNode
  /**
   * A React component that will be rendered in the IconButton at the right of the input.
   */
  rightIcon?: ReactNode
  /**
   * ID to find this component in testing tools (e.g.: cypress, testing library, and jest).
   *
   * @default 'store-quantity-selector'
   */
  testId?: string

  'aria-label'?: AriaAttributes['aria-label']
}

const QuantitySelector = ({
  quantity,
  onClickLeft,
  onClickRight,
  leftDisabled,
  rightDisabled,
  leftIcon = <MinusIcon color="#fff" />,
  rightIcon = <PlusIcon color="#fff" />,
  className,
  testId = 'store-quantity-selector',
  ...otherProps
}: QuantitySelectorProps) => {
  return (
    <div
      data-store-quantity-selector
      data-testid={testId}
      className={className}
    >
      <IconButton
        data-store-quantity-selector-button="left"
        icon={leftIcon}
        onClick={onClickLeft}
        disabled={leftDisabled}
      />
      <Input
        data-store-quantity-selector-input
        value={quantity}
        {...otherProps}
      />
      <IconButton
        data-store-quantity-selector-button="right"
        icon={rightIcon}
        onClick={onClickRight}
        disabled={rightDisabled}
      />
    </div>
  )
}

export default QuantitySelector
