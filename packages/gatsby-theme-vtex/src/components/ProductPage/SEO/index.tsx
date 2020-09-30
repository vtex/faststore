import React, { FC } from 'react'
import { Helmet } from 'react-helmet'

import { useCurrency } from '../../../sdk/localization/useCurrency'
import { Props } from '../../../templates/product'
import SiteMetadataSEO from '../../HomePage/SEO'
import { useAsyncProduct } from '../useAsyncProduct'
import { useStructuredProduct } from './useStructuredProduct'

const SEO: FC<Props> = (props) => {
  const slug = props.slug!
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
