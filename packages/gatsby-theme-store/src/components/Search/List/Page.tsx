import React from 'react'
import type { FC } from 'react'

import ProductSummary from '../../ProductSummary'

interface Props {
  products: any[]
}

const Page: FC<Props> = ({ products }) => (
  <>
    {products.map((product: any) => (
      <ProductSummary key={product!.id!} product={product} />
    ))}
  </>
)

export default Page
