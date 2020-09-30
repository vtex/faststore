import { Box } from '@vtex/store-ui'
import React, { FC } from 'react'

interface Props {
  variant: string
}

const OfferContainer: FC<Props> = ({ children, variant }) => (
  <Box variant={`offer.${variant}.container`}>{children}</Box>
)

export default OfferContainer
