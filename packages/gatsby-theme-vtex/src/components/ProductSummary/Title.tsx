import { Box } from '@vtex/store-ui'
import React, { FC } from 'react'

interface Props {
  variant?: string
}

const ProductSummaryTitle: FC<Props> = ({
  variant = 'productSummary',
  children,
}) => (
  <Box variant={`${variant}.title`} as="h3">
    {children}
  </Box>
)

export default ProductSummaryTitle
