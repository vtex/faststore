import React, { FC, lazy } from 'react'

import { Props } from './BuyButton'
import BuyButtonPreview from './Preview'
import SuspenseDelay from '../SuspenseDelay'

const BuyButtonImpl = lazy(() => import('./BuyButton'))

const BuyButton: FC<Props> = (props) => (
  <SuspenseDelay fallback={<BuyButtonPreview />}>
    <BuyButtonImpl {...props} />
  </SuspenseDelay>
)

export default BuyButton
