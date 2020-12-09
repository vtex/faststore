import React from 'react'
import { Box } from 'theme-ui'
import type { FC } from 'react'

interface Props {
  variant: string
}

const OfferListPrice: FC<Props> = ({ variant, children }) => (
  <Box variant={`offer.${variant}.listPrice`}>{children}</Box>
)

export default OfferListPrice
