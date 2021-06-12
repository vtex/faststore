import { Box } from 'theme-ui'
import React from 'react'
import type { FC } from 'react'

interface Props {
  variant: string
}

const ProductSummaryTitle: FC<Props> = ({ variant, children }) => (
  <Box variant={`productSummary.${variant}.title`} as="h3">
    {children}
  </Box>
)

export default ProductSummaryTitle
