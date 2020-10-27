import React, { FC } from 'react'
import { Heading } from 'theme-ui'

export interface ProductQuantityTitleProps {
  variant?: string
}

export const ProductQuantityTitle: FC<ProductQuantityTitleProps> = ({
  variant = 'productDescription',
  children,
}) => <Heading variant={`${variant}.title`}>{children}</Heading>
