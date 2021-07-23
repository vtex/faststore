import React from 'react'
import { Grid } from 'theme-ui'
import type {
  ComponentPropsWithoutRef,
  PropsWithChildren,
  ComponentType,
} from 'react'

export interface Product {
  id: string
}

export type ProductSummary<T extends Product> = ComponentType<{
  product: T
  position: number
}>

interface Props<T extends Product>
  extends ComponentPropsWithoutRef<typeof Grid> {
  items: T[]
  page: number
  pageSize: number
  pageSizes?: number[]
  variant: string
  ProductSummary: ProductSummary<T>
}

const ShelfPage = <T extends Product>({
  items,
  page,
  pageSize,
  pageSizes,
  variant,
  ProductSummary,
  ...props
}: PropsWithChildren<Props<T>>) => (
  <Grid
    {...props}
    data-testid="shelfPage"
    variant={`shelf.${variant}.page.container`}
    gap={2}
    columns={pageSizes}
    sx={{ width: '100%' }}
  >
    {items.map((item, index) => (
      <ProductSummary
        product={item}
        position={page * pageSize + index + 1}
        key={item.id}
      />
    ))}
  </Grid>
)

export default ShelfPage
