import {
  GatsbySeo,
  BreadcrumbJsonLd,
  ProductJsonLd,
} from 'gatsby-plugin-next-seo'
import React from 'react'
import type { FC } from 'react'

import { useMetadata } from './useMetadata'
import { useBreadcrumbJsonLd } from './useBreadcrumbJsonLd'
import { useProductJsonLd } from './useProductJsonLd'
import type { ProductViewProps } from '../index'

const SEO: FC<ProductViewProps> = (props) => {
  const metadata = useMetadata(props)
  const breadcrumbProps = useBreadcrumbJsonLd(props)
  const productProps = useProductJsonLd(props)

  return (
    <>
      <GatsbySeo {...metadata} defer />
      {breadcrumbProps !== null && (
        <BreadcrumbJsonLd {...breadcrumbProps} defer />
      )}
      {productProps !== null && <ProductJsonLd {...productProps} defer />}
    </>
  )
}

export default SEO
