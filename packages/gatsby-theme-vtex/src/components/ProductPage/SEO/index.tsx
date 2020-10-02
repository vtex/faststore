import React, { FC } from 'react'
import { Helmet } from 'react-helmet'

import { useCurrency } from '../../../sdk/localization/useCurrency'
import { ProductPageProps } from '../../../templates/product'
import SiteMetadataSEO from '../../HomePage/SEO'
import { useAsyncProduct } from '../useAsyncProduct'
import { useStructuredProduct } from './useStructuredProduct'

const SEO: FC<ProductPageProps> = (props) => {
  const { slug } = props
  const [currency] = useCurrency()
  const { product } = useAsyncProduct({ slug })
  const structuredProduct = useStructuredProduct(product as any, currency)

  // There is not product. There is no point on generating tags yet
  if (!product) {
    return <SiteMetadataSEO {...props} />
  }

  return (
    <>
      <SiteMetadataSEO {...props} />
      <Helmet
        script={[
          {
            type: 'application/ld+json',
            innerHTML: JSON.stringify(structuredProduct),
          },
        ]}
      />
    </>
  )
}

export default SEO
