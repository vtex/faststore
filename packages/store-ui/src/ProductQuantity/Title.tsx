import React, { FC } from 'react'
import { Label } from 'theme-ui'

export interface ProductQuantityTitleProps {
  variant?: string
}

export const ProductQuantityTitle: FC<ProductQuantityTitleProps> = ({
  variant = 'productDescription',
  children,
}) => (
  <Label htmlFor="product-quantity" variant={`${variant}.title`}>
    {children}
  </Label>
)
