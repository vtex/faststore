import React, { FC, lazy } from 'react'

import { Props as SiteMetadataProps } from '../siteMetadata/lazy'
import SuspenseSSR from '../../Suspense/SSR'

const StructuredData = lazy(() => import('./lazy'))
const SiteMetadataSEO = lazy(() => import('../siteMetadata/lazy'))

interface Props extends SiteMetadataProps {
  slug: string
}

const ProductDetailSEO: FC<Props> = (props) => (
  <SuspenseSSR fallback={null}>
    <SiteMetadataSEO {...props} />
    <StructuredData slug={props.slug} />
  </SuspenseSSR>
)

export default ProductDetailSEO
