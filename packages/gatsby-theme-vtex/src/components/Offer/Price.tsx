import React, { FC } from 'react'
import { Box } from '@vtex/store-ui'

import { useNumberFormat } from '../../sdk/localization/useNumberFormat'

interface Props {
  price: number
  variant: string
}

const OfferPrice: FC<Props> = ({ price, children, variant }) => {
  const { format } = useNumberFormat()

  return (
    <Box variant={`offer.${variant}.price`}>
      {format(price)}
      {children}
    </Box>
  )
}

export default OfferPrice
