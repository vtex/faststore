import React, { FC } from 'react'
import { Box } from '@vtex/store-ui'

import { useNumberFormat } from '../../sdk/localization/useNumberFormat'

interface Props {
  offer: {
    price: number
    listPrice: number
  }
  variant: string
}

const ListPrice: FC<Props> = ({ offer, variant }) => {
  const numberFormat = useNumberFormat()
  const price =
    offer.price === offer.listPrice
      ? null
      : numberFormat.format(offer.listPrice)

  return <Box variant={`${variant}.listPrice`}>{price}</Box>
}

export default ListPrice
