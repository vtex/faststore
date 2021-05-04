import {
  GatsbySeo,
  BreadcrumbJsonLd,
  ProductJsonLd,
} from 'gatsby-plugin-next-seo'
import React from 'react'
import type { FC } from 'react'

import { useMetadata } from './useMetadata'
import { useBreadcrumbJsonLd } from './useBreadcrumbJsonLd'
import type { ProductPageProps } from '../../../templates/product'
import { useProductJsonLd } from './useProductJsonLd'

const SEO: FC<ProductPageProps> = (props) => {
  const metadata = useMetadata(props)
  const breadcrumbProps = useBreadcrumbJsonLd(props)
  const productProps = useProductJsonLd(props)

  return (
    <>
      <GatsbySeo {...metadata} defer={false} />
      {breadcrumbProps !== null && (
        <BreadcrumbJsonLd {...breadcrumbProps} defer={false} />
      )}
      {productProps !== null && (
        <ProductJsonLd {...productProps} defer={false} />
      )}
    </>
  )
}

export default SEO
