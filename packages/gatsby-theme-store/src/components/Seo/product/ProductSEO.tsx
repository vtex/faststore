import React from 'react'
import {
  GatsbySeo,
  BreadcrumbJsonLd,
  ProductJsonLd,
} from 'gatsby-plugin-next-seo'
import type { FC } from 'react'

import { useMetadata } from '../../../sdk/seo/product/useMetadata'
import { useBreadcrumbJsonLd } from '../../../sdk/seo/product/useBreadcrumbJsonLd'
import { useProductJsonLd } from '../../../sdk/seo/product/useProductJsonLd'
import type { Options as MetadataOptions } from '../../../sdk/seo/product/useMetadata'
import type { Options as BreadcrumbOptions } from '../../../sdk/seo/product/useBreadcrumbJsonLd'
import type { Options as JsonLdOptions } from '../../../sdk/seo/product/useProductJsonLd'

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
