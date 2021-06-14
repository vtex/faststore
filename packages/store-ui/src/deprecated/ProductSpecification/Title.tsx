import React from 'react'
import { Heading } from 'theme-ui'
import type { FC } from 'react'

export interface ProductSpecificationTitleProps {
  variant?: string
}

export const ProductSpecificationTitle: FC<ProductSpecificationTitleProps> = ({
  variant = 'productSpecification',
  children,
}) => <Heading variant={`${variant}.title`}>{children}</Heading>
