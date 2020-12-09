/** @jsx jsx */
import { jsx, Grid } from '@vtex/store-ui'
import type { ComponentPropsWithoutRef, FC } from 'react'

import ProductSummary from '../ProductSummary'
import type { ProductSummary_ProductFragment } from '../ProductSummary/__generated__/ProductSummary_product.graphql'

interface Props extends ComponentPropsWithoutRef<typeof Grid> {
  items: Array<ProductSummary_ProductFragment | undefined | null>
  pageSizes?: number[]
  variant: string
}

const ShelfPage: FC<Props> = ({ items, pageSizes, variant, ...props }) => (
  <Grid
    {...props}
    variant={`shelf.${variant}.page.container`}
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
