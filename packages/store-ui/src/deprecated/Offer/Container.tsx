import { Box } from 'theme-ui'
import React from 'react'
import type { FC } from 'react'

interface Props {
  variant: string
}

const OfferContainer: FC<Props> = ({ children, variant }) => (
  <Box variant={`offer.${variant}.container`}>{children}</Box>
)

export default OfferContainer
