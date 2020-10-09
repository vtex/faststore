import React, { FC } from 'react'
import { Helmet } from 'react-helmet'

import { useCurrency } from '../../../sdk/localization/useCurrency'
import { ProductPageProps } from '../../../templates/product'
import { useStructuredProduct } from './useStructuredProduct'
import SiteMetadataSEO from '../../HomePage/SEO'

const SEO: FC<ProductPageProps> = (props) => {
  const {
    data: {
      vtex: { product },
    },
  } = props

  const [currency] = useCurrency()
  const structuredProduct = useStructuredProduct(product!, currency)

  return (
    <>
      <SiteMetadataSEO {...props} />
      {structuredProduct != null && (
        <Helmet
          script={[
            {
              type: 'application/ld+json',
              innerHTML: JSON.stringify(structuredProduct),
            },
          ]}
        />
      )}
    </>
  )
}

export default SEO
