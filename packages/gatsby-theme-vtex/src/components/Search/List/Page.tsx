import React, { FC } from 'react'

import ProductSummary from '../../ProductSummary'
import { ProductSummary_ProductFragment } from '../../__generated__/ProductSummary_product.graphql'

interface Props {
  products: Array<Maybe<ProductSummary_ProductFragment>>
}

const Page: FC<Props> = ({ products }) => (
  <>
    {products.map((product, index) => (
      <ProductSummary
        loading={index === 0 ? 'eager' : 'lazy'}
        key={product!.productId!}
        product={product!}
      />
    ))}
  </>
)

export default Page
