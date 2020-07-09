import React, { FC, useMemo } from 'react'
import { Helmet } from 'react-helmet'

import { useAsyncProduct } from '../../../providers/AsyncProducts/controler'
import { useCurrency } from '../../../providers/Binding/controler'
import { transform } from './structured'

const SEO: FC = () => {
  const [currency] = useCurrency()
  const product = useAsyncProduct()
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
