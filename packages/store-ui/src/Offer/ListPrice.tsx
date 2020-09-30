import React, { FC } from 'react'
import { Box } from 'theme-ui'

interface Props {
  variant: string
}

const OfferListPrice: FC<Props> = ({ variant, children }) => {
  if (children === 0) {
    return null
  }

  return <Box variant={`offer.${variant}.listPrice`}>{children}</Box>
}

export default OfferListPrice
