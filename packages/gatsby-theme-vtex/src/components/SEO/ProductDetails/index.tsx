import React, { FC, lazy } from 'react'

import { SuspenseIdle } from '../../SuspenseIdle'
import { Props as SiteMetadataProps } from '../siteMetadata/lazy'

const StructuredData = lazy(() => import('./lazy'))
const SiteMetadataSEO = lazy(() => import('../siteMetadata/lazy'))

interface Props extends SiteMetadataProps {
  productId: string
}

const ProductDetailSEO: FC<Props> = (props) => (
  <>
    <SuspenseIdle fallback={null}>
      <SiteMetadataSEO {...props} />
    </SuspenseIdle>
    <SuspenseIdle fallback={null}>
      <StructuredData productId={props.productId} />
    </SuspenseIdle>
  </>
)

export default ProductDetailSEO
