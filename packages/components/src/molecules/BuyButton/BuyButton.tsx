import React from 'react'

import { Button, Icon } from '../../index'
import type { ButtonProps } from '../../index'
import { ShoppingCart } from '../../assets'

type Props = ButtonProps

function BuyButton({ icon, children, ...otherProps }: Props) {
  return (
    <Button data-fs-buy-button {...otherProps}>
      <Icon component={<ShoppingCart />} />
      {children}
    </Button>
  )
}

export default BuyButton
