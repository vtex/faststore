import React, { FC, lazy } from 'react'

import { SuspenseSSR } from '../SuspenseSSR'
import { Props } from './lazy'
import { OfferPreview } from './preview'

const AsyncOffer = lazy(() => import('./lazy'))

export const Offer: FC<Props> = ({ index }) => (
  <SuspenseSSR fallback={<OfferPreview />}>
    <AsyncOffer index={index} />
  </SuspenseSSR>
)
