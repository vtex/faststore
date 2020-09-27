import { Box } from '@vtex/store-ui'
import React, { FC } from 'react'

interface Props {
  variant?: string
}

const ProductDetailsReference: FC<Props> = ({
  children,
  variant = 'details',
}) => <Box variant={`product.${variant}.reference`}>{children}</Box>

export default ProductDetailsReference
