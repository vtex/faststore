import React, { FC } from 'react'
import Box from '@material-ui/core/Box'
import Skeleton from 'react-loading-skeleton'

interface Props {
  variant?: string
}

const OfferPreview: FC<Props> = () => (
  <Box display="flex">
    <Skeleton height={20} />
    <Skeleton height={23} />
    <Skeleton height={20} />
  </Box>
)

export default OfferPreview
