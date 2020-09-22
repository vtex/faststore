import React, { FC } from 'react'
import { Heading } from 'theme-ui'

export interface ProductSpecificationTitleProps {
  variant?: string
}

export const ProductSpecificationTitle: FC<ProductSpecificationTitleProps> = ({
  variant = 'productSpecification',
  children,
}) => <Heading variant={`${variant}.title`}>{children}</Heading>
