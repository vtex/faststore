import React from 'react'
import { Label } from 'theme-ui'
import type { FC } from 'react'

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
