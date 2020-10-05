import React, { FC } from 'react'
import { Box } from 'theme-ui'

interface Props {
  variant: string
}

const ProductDetailsTitle: FC<Props> = ({ variant, children }) => (
  <Box variant={`productDetails.${variant}.title`} as="h1">
    {children}
  </Box>
)

export default ProductDetailsTitle
