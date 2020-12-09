import React from 'react'
import { Box } from 'theme-ui'
import type { FC } from 'react'

interface Props {
  variant: string
}

const ProductDetailsTitle: FC<Props> = ({ variant, children }) => (
  <Box variant={`productDetails.${variant}.title`} as="h1">
    {children}
  </Box>
)

export default ProductDetailsTitle
