import React from 'react'

import { Button } from '../../'
import type { ButtonProps } from '../../'

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
      icon={icon}
      iconPosition="left"
      data-testid={testId}
      {...otherProps}
    >
      {children}
    </Button>
  )
}

export default BuyButton
