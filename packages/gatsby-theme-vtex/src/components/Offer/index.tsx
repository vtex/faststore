import React, { FC, lazy, Suspense } from 'react'

import { isServer } from '../../utils/env'

const AsyncOffer = lazy(() => import('./lazy'))

export const OfferLoading: FC = () => (
  <>
    <div>Loading Best Offer Price</div>
    <div>Loading Best Offer Availability</div>
  </>
)

export const Offer: FC = () => {
  if (isServer) {
    return <OfferLoading />
  }

  return (
    <Suspense fallback={<OfferLoading />}>
      <AsyncOffer />
    </Suspense>
  )
}
