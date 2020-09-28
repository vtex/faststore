import { Heading } from '@vtex/store-ui'
import React, { FC } from 'react'

interface Props {
  variant?: string
}

const ProductDetailsTitle: FC<Props> = ({
  variant = 'productDetails',
  children,
}) => (
  <Heading variant={`${variant}.title`} as="h1">
    {children}
  </Heading>
)

export default ProductDetailsTitle
