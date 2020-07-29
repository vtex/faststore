import React, { FC } from 'react'
import { Box } from 'theme-ui'

import { OfferBlocksProps } from './OfferBlocks'

const Availability: FC<OfferBlocksProps> = ({ variant, offer }) => {
  return (
    <Box variant={`${variant}.availability`}>
      {offer.AvailableQuantity} units left!
    </Box>
  )
}

export default Availability
