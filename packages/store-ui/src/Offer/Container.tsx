import { Box } from 'theme-ui'
import React, { FC } from 'react'

interface Props {
  variant: string
}

const OfferContainer: FC<Props> = ({ children, variant }) => (
  <Box variant={`offer.${variant}.container`}>{children}</Box>
)

export default OfferContainer
