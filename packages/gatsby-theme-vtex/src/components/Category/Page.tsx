import { Product } from '@vtex/gatsby-source-vtex'
import React, { FC } from 'react'

import { ProductSummary } from '../ProductSummary'

interface Props {
  products: Product[]
}

const Page: FC<Props> = ({ products }) => (
  <>
    {products.map((product) => (
      <ProductSummary key={product.productId} syncProduct={product} />
    ))}
  </>
)

export default Page
