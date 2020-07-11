import React, { FC, lazy } from 'react'

import { Props } from './BuyButton'
import BuyButtonPreview from './Preview'
import { SuspenseSSR } from '../SuspenseSSR'

const BuyButtonImpl = lazy(() => import('./BuyButton'))

const BuyButton: FC<Props> = (props) => (
  <SuspenseSSR fallback={<BuyButtonPreview />}>
    <BuyButtonImpl {...props} />
  </SuspenseSSR>
)

export default BuyButton
