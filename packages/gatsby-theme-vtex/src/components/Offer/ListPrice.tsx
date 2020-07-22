import { CommertialOffer } from '@vtex/gatsby-source-vtex'
import React, { FC } from 'react'
import { Box } from 'theme-ui'
import { useNumberFormat } from '../../providers/NumberFormat'
import { SyncProductCommertialOffer } from '../../types/product'

interface Props {
  offer: SyncProductCommertialOffer
  variant: string
}

const ListPrice: FC<Props> = ({ offer, variant }) => {
  const numberFormat = useNumberFormat()
  if (offer.Price === offer.ListPrice) {
    return null
  }
  return (
    <Box variant={`${variant}-listPrice`}>
      {numberFormat.format(offer.ListPrice)}
    </Box>
  )
}

export default ListPrice
