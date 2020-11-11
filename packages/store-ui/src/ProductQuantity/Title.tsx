import React, { FC } from 'react'
import { Label } from 'theme-ui'

export interface ProductQuantityTitleProps {
  htmlFor?: string
  variant?: string
}

export const ProductQuantityTitle: FC<ProductQuantityTitleProps> = ({
  variant = 'productDescription',
  children,
  htmlFor = 'product-quantity',
}) => (
  <Label htmlFor={htmlFor} variant={`${variant}.title`}>
    {children}
  </Label>
)
