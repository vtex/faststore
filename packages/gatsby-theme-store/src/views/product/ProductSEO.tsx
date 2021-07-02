import React from 'react'
import {
  GatsbySeo,
  BreadcrumbJsonLd,
  ProductJsonLd,
} from 'gatsby-plugin-next-seo'
import type { FC } from 'react'

import { useMetadata } from './useMetadata'
import { useBreadcrumbJsonLd } from './useBreadcrumbJsonLd'
import { useProductJsonLd } from './useProductJsonLd'
import type { Options as MetadataOptions } from './useMetadata'
import type { Options as BreadcrumbOptions } from './useBreadcrumbJsonLd'
import type { Options as JsonLdOptions } from './useProductJsonLd'

export type Props = BreadcrumbOptions & MetadataOptions & JsonLdOptions

const ProductSEO: FC<Props> = (props) => {
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

export default ProductSEO
