import { Box } from 'theme-ui'
import React, { FC } from 'react'

interface Props {
  variant: string
}

const OfferSoldOut: FC<Props> = ({ children, variant }) => (
  <Box variant={`offer.${variant}.soldout`}>{children}</Box>
)

export default OfferSoldOut
