import React, { FC, lazy } from 'react'

import SuspenseSSR from '../SuspenseSSR'
import { Props } from './BuyButton'
import BuyButtonPreview from './Preview'

const BuyButtonImpl = lazy(() => import('./BuyButton'))

const BuyButton: FC<Props> = (props) => (
  <SuspenseSSR fallback={<BuyButtonPreview />}>
    <BuyButtonImpl {...props} />
  </SuspenseSSR>
)

export default BuyButton
