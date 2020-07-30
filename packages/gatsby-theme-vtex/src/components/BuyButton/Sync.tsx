import React, { FC, lazy } from 'react'

import SuspenseSSR from '../SuspenseSSR'
import { Props } from './BuyButton'
import BuyButtonPreview from './Preview'

const BuyButtonImpl = lazy(() => import('./BuyButton'))

const BuyButton: FC<Props> = (props) => (
  <SuspenseSSR key="BuyButtonSuspenseSSR" fallback={<BuyButtonPreview />}>
    <BuyButtonImpl key="BuyButtonImpl" {...props} />
  </SuspenseSSR>
)

export default BuyButton
