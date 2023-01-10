import React from 'react'

import { Button, Icon } from '../../index'
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
    <Button data-fs-buy-button data-testid={testId} {...otherProps}>
      <Icon component={<ShoppingCart />} />
      {children}
    </Button>
  )
}

export default BuyButton
