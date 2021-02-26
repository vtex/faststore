import React from 'react'
import type { FC } from 'react'

import ProductSummary from '../../ProductSummary'
import type { ProductSummary_ProductFragment } from '../../ProductSummary/__generated__/ProductSummary_product.graphql'

interface Props {
  products: Array<Maybe<ProductSummary_ProductFragment>>
}

const Page: FC<Props> = ({ products }) => (
  <>
    {products.map((product) => (
      <ProductSummary
        loading="lazy"
        key={product!.productId!}
        product={product!}
      />
    ))}
  </>
)

export default Page
