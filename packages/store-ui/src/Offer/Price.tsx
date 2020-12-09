import React from 'react'
import { Box } from 'theme-ui'
import type { FC } from 'react'

interface Props {
  variant: string
}

const OfferPrice: FC<Props> = ({ children, variant }) => (
  <Box variant={`offer.${variant}.price`}>{children}</Box>
)

export default OfferPrice
