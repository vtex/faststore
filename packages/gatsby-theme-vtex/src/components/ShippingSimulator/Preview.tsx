import React, { FC } from 'react'
import { Box } from '@vtex/store-ui'
import Skeleton from '@vtex/store-ui/src/Skeleton'

interface Props {
  variant: string
}

const ShippingSimulatorPreview: FC<Props> = ({ variant }) => (
  <Box variant={variant} sx={{ marginX: 10 }}>
    <Skeleton height="20px" />
  </Box>
)

export default ShippingSimulatorPreview
