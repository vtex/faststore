import React, { FC, lazy } from 'react'

import { SuspenseSSR } from '../../SuspenseSSR'
import { Props } from '../siteMetadata/lazy'

const StructuredData = lazy(() => import('./lazy'))
const SiteMetadataSEO = lazy(() => import('../siteMetadata/lazy'))

const ProductDetailSEO: FC<Props> = (props) => (
  <SuspenseSSR fallback={null}>
    <SiteMetadataSEO {...props} />
    <StructuredData />
  </SuspenseSSR>
)

export default ProductDetailSEO
