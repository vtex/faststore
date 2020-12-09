import React from 'react'
import { Box } from 'theme-ui'
import type { FC } from 'react'

interface Props {
  variant: string
}

const ProductDetailsReference: FC<Props> = ({ variant, children }) => (
  <Box variant={`productDetails.${variant}.reference`}>{children}</Box>
)

export default ProductDetailsReference
