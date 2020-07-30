import React, { FC } from 'react'

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
    <div
      style={{
        textDecoration: 'line-through',
        fontSize: '.875rem',
        minHeight: '21px',
        color: '#727273',
      }}
    >
      {price}
    </div>
  )
}

export default ListPrice
