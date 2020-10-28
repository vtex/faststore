import React, { FC } from 'react'
import { Text } from 'theme-ui'

export interface ProductQuantityTitleProps {
  variant?: string
}

export const ProductQuantityTitle: FC<ProductQuantityTitleProps> = ({
  variant = 'productDescription',
  children,
}) => <Text variant={`${variant}.title`}>{children}</Text>
