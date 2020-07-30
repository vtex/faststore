import React, { FC } from 'react'
import { Box } from '@material-ui/core'

import { useNumberFormat } from '../../providers/NumberFormat'
import { SyncProductCommertialOffer } from '../../types/product'

interface Props {
  offer: SyncProductCommertialOffer
  variant: string
}

const ListPrice: FC<Props> = ({ offer }) => {
  const numberFormat = useNumberFormat()
  const price =
    offer.Price === offer.ListPrice
      ? null
      : numberFormat.format(offer.ListPrice)

  return (
    <Box
      style={{
        textDecoration: 'line-through',
        fontSize: '.875rem',
        minHeight: '21px',
        color: '#727273',
      }}
    >
      {price}
    </Box>
  )
}

export default ListPrice
