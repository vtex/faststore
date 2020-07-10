import React, { FC, useMemo } from 'react'
import { Helmet } from 'react-helmet'

import { useCurrency } from '../../../providers/Currency'
import { transform } from './structured'
import { useAsyncProduct } from '../../../providers/Product'

interface Props {
  productId: string
}

const SEO: FC<Props> = ({ productId }) => {
  const [currency] = useCurrency()
  const { product } = useAsyncProduct({ productIds: [productId] })
  const structuredProduct = useMemo(
    () => (product ? transform(product, currency) : ''),
    [product, currency]
  )

  // There is not product. There is no point on generating tags yet
  if (!product) {
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

export default SEO
