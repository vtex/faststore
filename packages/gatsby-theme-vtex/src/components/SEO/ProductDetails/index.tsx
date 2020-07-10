import React, { FC, lazy } from 'react'

import { SuspenseSSR } from '../../SuspenseSSR'
import { Props as SiteMetadataProps } from '../siteMetadata/lazy'

const StructuredData = lazy(() => import('./lazy'))
const SiteMetadataSEO = lazy(() => import('../siteMetadata/lazy'))

interface Props extends SiteMetadataProps {
  productId: string
}

const ProductDetailSEO: FC<Props> = (props) => (
  <SuspenseSSR fallback={null}>
    <SiteMetadataSEO {...props} />
    <StructuredData productId={props.productId} />
  </SuspenseSSR>
)

export default ProductDetailSEO
