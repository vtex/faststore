import React from 'react'
import { Heading } from 'theme-ui'
import type { FC } from 'react'

export interface ProductDescriptionTitleProps {
  variant?: string
}

export const ProductDescriptionTitle: FC<ProductDescriptionTitleProps> = ({
  variant = 'productDescription',
  children,
}) => <Heading variant={`${variant}.title`}>{children}</Heading>
