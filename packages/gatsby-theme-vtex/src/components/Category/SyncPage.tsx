import { Product } from '@vtex/gatsby-source-vtex'
import React, { FC } from 'react'

import { ProductSummary } from '../ProductSummary'

interface Props {
  products: Product[]
}

const LAZY_LOAD_INDEX = 3

const Page: FC<Props> = ({ products }) => (
  <>
    {products.map((product, index) => (
      <ProductSummary
        key={product.productId}
        syncProduct={product}
        lazyLoad={index > LAZY_LOAD_INDEX}
      />
    ))}
  </>
)

export default Page
