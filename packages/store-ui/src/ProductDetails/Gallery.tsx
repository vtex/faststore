import { Box } from 'theme-ui'
import React, { FC } from 'react'

interface Props {
  variant: string
}

const ProductDetailsGallery: FC<Props> = ({ variant, children }) => (
  <Box variant={`productDetails.${variant}.gallery`} as="h3">
    {children}
  </Box>
)

export default ProductDetailsGallery
