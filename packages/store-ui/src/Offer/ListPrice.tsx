import React, { FC } from 'react'
import { Box } from 'theme-ui'

interface Props {
  variant: string
}

const OfferListPrice: FC<Props> = ({ variant, children }) => (
  <Box variant={`offer.${variant}.listPrice`}>{children}</Box>
)

export default OfferListPrice
