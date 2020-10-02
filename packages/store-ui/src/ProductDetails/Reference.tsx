import React, { FC } from 'react'
import { Box } from 'theme-ui'

interface Props {
  variant: string
}

const ProductDetailsReference: FC<Props> = ({ variant, children }) => (
  <Box variant={`productDetails.${variant}.reference`}>{children}</Box>
)

export default ProductDetailsReference
