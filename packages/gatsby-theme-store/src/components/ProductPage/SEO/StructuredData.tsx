import React from 'react'
import { Helmet } from 'react-helmet-async'
import type { FC } from 'react'

import { useCurrency } from '../../../sdk/localization/useCurrency'
import { useStructuredProduct } from './useStructuredProduct'
import type { ProductPageProps } from '../../../templates/product'

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
      defer={false}
      async={false}
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
