import React, { FC } from 'react'
import { Box } from 'theme-ui'

import { useNumberFormat } from '../../providers/NumberFormat'

interface Props {
  offer: {
    Price: number
    ListPrice: number
  }
  variant: string
}

const ListPrice: FC<Props> = ({ offer, variant }) => {
  const numberFormat = useNumberFormat()
  const price =
    offer.Price === offer.ListPrice
      ? null
      : numberFormat.format(offer.ListPrice)

  return <Box variant={`${variant}.listPrice`}>{price}</Box>
}

export default ListPrice
