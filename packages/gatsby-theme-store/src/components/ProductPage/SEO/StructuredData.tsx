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
  const pageStructuredData = useStructuredProduct(product!, currency)

  if (pageStructuredData.length === 0) {
    return null
  }

  return (
    <Helmet
      script={[
        {
          type: 'application/ld+json',
          innerHTML: JSON.stringify(pageStructuredData),
        },
      ]}
    />
  )
}

export default StructuredData
