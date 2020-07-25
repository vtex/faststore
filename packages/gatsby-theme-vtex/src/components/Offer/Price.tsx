import React, { FC } from 'react'
// import Skeleton from 'react-loading-skeleton'
import { Box } from 'theme-ui'

import { useNumberFormat } from '../../providers/NumberFormat'
import { SyncProductCommertialOffer } from '../../types/product'

export interface Props {
  offer?: SyncProductCommertialOffer
  variant?: string
}

const Price: FC<Props> = ({ offer, variant }) => {
  const numberFormat = useNumberFormat()

  return (
    <Box variant={`${variant}-price`}>
      {!offer ? null : numberFormat.format(offer.Price)}
    </Box>
  )
}

export default Price
