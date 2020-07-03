import React, { FC, Suspense, lazy } from 'react'

import { isServer } from '../../utils/env'
import { Options } from './lazy'

const AsyncOffer = lazy(() => import('./lazy'))

export const OfferLoading: FC = () => (
  <>
    <div>Loading Best Offer Price</div>
    <div>Loading Best Offer Availability</div>
  </>
)

export const Offer: FC<Partial<Options>> = ({ product }) => {
  if (isServer || !product) {
    return <OfferLoading />
  }

  return (
    <Suspense fallback={<OfferLoading />}>
      <AsyncOffer product={product} />
    </Suspense>
  )
}
