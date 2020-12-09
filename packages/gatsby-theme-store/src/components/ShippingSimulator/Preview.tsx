import { Box, Skeleton } from '@vtex/store-ui'
import React from 'react'
import type { FC } from 'react'

interface Props {
  variant: string
}

const ShippingSimulatorPreview: FC<Props> = ({ variant }) => (
  <Box variant={variant} sx={{ marginX: 10 }}>
    <Skeleton height="20px" />
  </Box>
)

export default ShippingSimulatorPreview
