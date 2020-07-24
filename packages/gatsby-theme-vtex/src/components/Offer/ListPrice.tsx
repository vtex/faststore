import React, { FC } from 'react'
import { Box } from 'theme-ui'
import Skeleton from 'react-loading-skeleton'

import { useNumberFormat } from '../../providers/NumberFormat'
import { SyncProductCommertialOffer } from '../../types/product'

interface Props {
  offer?: SyncProductCommertialOffer
  variant: string
}

const ListPrice: FC<Props> = ({ offer, variant }) => {
  const numberFormat = useNumberFormat()
  const loading = !offer
  const price =
    offer?.Price === offer?.ListPrice || !offer
      ? null
      : numberFormat.format(offer.ListPrice)

  return (
    <Box variant={`${variant}-listPrice`}>{loading ? <Skeleton /> : price}</Box>
  )
}

export default ListPrice
