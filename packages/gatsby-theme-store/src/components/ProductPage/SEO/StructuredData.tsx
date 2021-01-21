import React from 'react'
import type { FC } from 'react'

import { useCurrency } from '../../../sdk/localization/useCurrency'
import { useStructuredProduct } from './useStructuredProduct'
import type { ProductPageProps } from '../../../templates/product'
import Helmet from '../../SEO/Helmet'

interface Props extends ProductPageProps {
  siteMetadata: any
}

const StructuredData: FC<Props> = ({
  data: {
    vtex: { product },
  },
}) => {
  const [currency] = useCurrency()
  const structuredProduct = useStructuredProduct(product!, currency)

  if (structuredProduct == null) {
    return null
  }

  return (
    <Helmet
      script={[
        {
          type: 'application/ld+json',
          innerHTML: JSON.stringify(structuredProduct),
        },
      ]}
    />
  )
}

export default StructuredData
