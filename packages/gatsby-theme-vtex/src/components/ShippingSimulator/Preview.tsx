import React, { FC } from 'react'
import Skeleton from 'react-loading-skeleton'
import { Box } from '@vtex/store-ui'

interface Props {
  variant?: string
}

const OfferPreview: FC<Props> = ({ variant = '' }) => (
  <Box variant={`${variant}.preview`}>
    <Skeleton height={20} />
  </Box>
)

export default OfferPreview
