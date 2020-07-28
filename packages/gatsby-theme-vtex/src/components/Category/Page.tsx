import { Product } from '@vtex/gatsby-source-vtex'
import React, { FC } from 'react'

import Grid from '../material-ui-components/Grid'
import { ProductSummary } from '../ProductSummary'

interface Props {
  products: Product[]
}

const Page: FC<Props> = ({ products }) => (
  <Grid item container>
    {products.map((product) => (
      <Grid key={product.productId} xs={12} sm={6} md={4} lg={3}>
        <ProductSummary syncProduct={product} />
      </Grid>
    ))}
  </Grid>
)

export default Page
