import React from 'react'

import { Button } from '../../index'
import type { ButtonProps } from '../../index'
import { ShoppingCart } from '../../assets'

type BuyButtonProps = ButtonProps

function BuyButton({
  testId = 'fs-buy-button',
  icon,
  children,
  ...otherProps
}: BuyButtonProps) {
  return (
    <Button
      data-fs-buy-button
      icon={<ShoppingCart />}
      iconPosition="left"
      data-testid={testId}
      {...otherProps}
    >
      {children}
    </Button>
  )
}

export default BuyButton
