import React, { FC, useMemo } from 'react'
import { Helmet } from 'react-helmet'

import { useCurrency } from '../../../sdk/localization/useCurrency'
import { useAsyncProduct } from '../../../sdk/product/useAsyncProduct'
import { ProductPageProps } from '../../../templates/product'
import SiteMetadataSEO from '../../HomePage/SEO'
import { transform } from './structured'

const SEO: FC<ProductPageProps> = (props) => {
  const { slug } = props
  const [currency] = useCurrency()
  const { product } = useAsyncProduct(slug!)
  const structuredProduct = useMemo(
    () => (product ? transform(product as any, currency) : ''),
    [product, currency]
  )

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
