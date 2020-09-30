import React, { FC, Fragment } from 'react'
import Skeleton from 'react-loading-skeleton'

const OfferPreview: FC = () => (
  <Fragment>
    <Skeleton height={20} />
    <Skeleton height={23} />
    <Skeleton height={20} />
  </Fragment>
)

export default OfferPreview
