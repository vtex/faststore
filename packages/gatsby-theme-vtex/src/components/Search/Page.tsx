import React, { FC } from 'react'

import { ProductSummary_SyncProductFragment } from '../__generated__/ProductSummary_syncProduct.graphql'
import { ProductSummary } from '../ProductSummary'

interface Props {
  products: Array<ProductSummary_SyncProductFragment | undefined | null>
}

const Page: FC<Props> = ({ products }) => (
  <>
    {products.map((product) => (
      <ProductSummary key={product!.productId!} product={product!} />
    ))}
  </>
)

export default Page
