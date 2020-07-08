import React, { FC, lazy } from 'react'

import { SuspenseSSR } from '../../SuspenseSSR'
import { Props } from './lazy'

const SEO = lazy(() => import('./lazy'))

const ProductDetailSEO: FC<Props> = (props) => (
  <SuspenseSSR fallback={null}>
    <SEO {...props} />
  </SuspenseSSR>
)

export default ProductDetailSEO
