import React, { FC, lazy, Suspense } from 'react'

import { isServer } from '../../utils/env'
import { Props } from './lazy'

const AsyncOffer = lazy(() => import('./lazy'))

export const OfferLoading: FC = () => (
  <>
    <div>Loading Best Offer Price</div>
    <div>Loading Best Offer Availability</div>
  </>
)

export const Offer: FC<Props> = ({ index }) => {
  if (isServer) {
    return <OfferLoading />
  }

  return (
    <Suspense fallback={<OfferLoading />}>
      <AsyncOffer index={index} />
    </Suspense>
  )
}
