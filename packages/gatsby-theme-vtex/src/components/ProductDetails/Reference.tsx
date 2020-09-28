import { Box } from '@vtex/store-ui'
import React, { FC } from 'react'

interface Props {
  variant?: string
}

const ProductDetailsReference: FC<Props> = ({
  variant = 'productDetails',
  children,
}) => <Box variant={`${variant}.reference`}>{children}</Box>

export default ProductDetailsReference
