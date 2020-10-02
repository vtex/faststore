import React, { FC } from 'react'
import { Box } from '@vtex/store-ui'

type Props = {
  shipping: any
  variant: string
}

const ShippingTable: FC<Props> = ({ shipping, variant }) => {
  return (
    <Box variant={`${variant}.shippingTable`}>
      {JSON.stringify(shipping, null, 2)}
    </Box>
  )
}

export default ShippingTable
