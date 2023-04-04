import React from 'react'

import type { ButtonProps } from '../../'
import { Button, Icon } from '../../'

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
      icon={<Icon name="ShoppingCart" />}
      iconPosition="left"
      data-testid={testId}
      {...otherProps}
    >
      {children}
    </Button>
  )
}

export default BuyButton
