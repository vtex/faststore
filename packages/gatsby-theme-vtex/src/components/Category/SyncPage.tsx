import { Product } from '@vtex/gatsby-source-vtex'
import React, { FC } from 'react'
import { Grid } from 'theme-ui'

import { ProductSummary } from '../ProductSummary'

interface Props {
  products: Product[]
}

const LAZY_LOAD_INDEX = 3

const COLUMNS = [1, 2, 3, 4]

// PAGE_SIZE has to be a multiple of columns
export const PAGE_SIZE = 12

const Page: FC<Props> = ({ products }) => (
  <Grid my={2} gap={3} columns={COLUMNS}>
    {products.map((product, index) => (
      <ProductSummary
        key={product.productId}
        syncProduct={product}
        lazyLoad={index > LAZY_LOAD_INDEX}
      />
    ))}
  </Grid>
)

export default Page
