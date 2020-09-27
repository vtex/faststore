import { Heading } from '@vtex/store-ui'
import React, { FC } from 'react'

interface Props {
  variant?: string
}

const ProductDetailsTitle: FC<Props> = ({ children, variant = 'details' }) => (
  <Heading variant={`product.${variant}.title`} as="h1">
    {children}
  </Heading>
)

export default ProductDetailsTitle
