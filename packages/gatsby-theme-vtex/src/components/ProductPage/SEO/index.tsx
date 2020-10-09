import React, { FC } from 'react'
import { Helmet } from 'react-helmet'

import { useCurrency } from '../../../sdk/localization/useCurrency'
import { ProductPageProps } from '../../../templates/product'
import { useStructuredProduct } from './useStructuredProduct'
import { useAsyncProduct } from '../useAsyncProduct'
import SiteMetadataSEO from '../../HomePage/SEO'

const SEO: FC<ProductPageProps> = (props) => {
  const { slug } = props
  const [currency] = useCurrency()
  const { product }: any = useAsyncProduct({ slug })
  const structuredProduct = useStructuredProduct(product, currency)

  return (
    <>
      <SiteMetadataSEO {...props} />
      {structuredProduct != null ? (
        <Helmet
          script={[
            {
              type: 'application/ld+json',
              innerHTML: JSON.stringify(structuredProduct),
            },
          ]}
        />
      ) : null}
    </>
  )
}

export default SEO
