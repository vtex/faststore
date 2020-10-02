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

  // There is no product. There is no point on generating tags yet
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
