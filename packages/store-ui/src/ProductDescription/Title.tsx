import React, { FC } from 'react'
import { Heading } from 'theme-ui'

export interface ProductDescriptionTitleProps {
  variant?: string
}

export const ProductDescriptionTitle: FC<ProductDescriptionTitleProps> = ({
  variant = 'productDescription',
  children,
}) => <Heading variant={`${variant}.title`}>{children}</Heading>
