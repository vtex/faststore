/** @jsx jsx */
import { FC } from 'react'
import { jsx, Grid } from '@vtex/store-ui'

import { ProductSummary_ProductFragment } from '../__generated__/ProductSummary_product.graphql'
import ProductSummary from '../ProductSummary'

interface Props {
  items: Array<ProductSummary_ProductFragment | undefined | null>
  pageSizes?: number[]
}

const ShelfPage: FC<Props> = ({ items, pageSizes }) => (
  <Grid
    variant="shelfContainer"
    gap={2}
    columns={pageSizes}
    sx={{ width: '100%' }}
  >
    {items.map((item) => (
      <ProductSummary key={item!.productId!} product={item!} />
    ))}
  </Grid>
)

export default ShelfPage
