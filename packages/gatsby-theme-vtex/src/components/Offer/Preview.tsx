import React, { FC } from 'react'
import Skeleton from 'react-loading-skeleton'

const OfferPreview: FC = () => (
  <>
    <Skeleton height={21} />
    <Skeleton height={28} />
    <Skeleton height={21} />
  </>
)

export default OfferPreview
