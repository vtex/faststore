import React, { FC, lazy } from 'react'

import { SuspenseIdle } from '../../SuspenseIdle'
import { Props } from './lazy'

const LazySEO = lazy(() => import('./lazy'))

const SEO: FC<Props> = (props) => (
  <SuspenseIdle fallback={null}>
    <LazySEO {...props} />
  </SuspenseIdle>
)

export default SEO
