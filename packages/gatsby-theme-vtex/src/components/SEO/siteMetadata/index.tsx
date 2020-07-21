import React, { FC, lazy } from 'react'

import { Props } from './lazy'
import SuspenseSSR from '../../SuspenseSSR'

const SEO = lazy(() => import('./lazy'))

const ProductDetailSEO: FC<Props> = (props) => (
  <SuspenseSSR fallback={null}>
    <SEO {...props} />
  </SuspenseSSR>
)

export default ProductDetailSEO
