import React, { FC } from 'react'

import { ProductSummary_ProductFragment } from '../../ProductSummary/__generated__/ProductSummary_product.graphql'
import ProductSummary from '../../ProductSummary'

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
