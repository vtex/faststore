import React from 'react'

import { Button, Icon } from '../../index'
import type { ButtonProps } from '../../index'
import { ShoppingCart } from '../../assets'

type Props = ButtonProps

function ButtonBuy({ icon, children, ...otherProps }: Props) {
  return (
    <Button data-fs-button-buy {...otherProps}>
      <Icon component={<ShoppingCart />} />
      {children}
    </Button>
  )
}

export default ButtonBuy
