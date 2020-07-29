import React, { FC } from 'react'
import type { Theme } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import { Product } from '@vtex/gatsby-source-vtex'

import Grid from '../material-ui-components/Grid'
import { ProductSummary } from '../ProductSummary'

interface Props {
  products: Product[]
}

const useStyles = makeStyles((theme: Theme) => ({
  summary: {
    padding: theme.spacing(1),
  }
}))

const Page: FC<Props> = ({ products }) => {
  const classes = useStyles()

  return (
    <Grid item container>
      {products.map((product) => (
        <Grid
          className={classes.summary}
          key={product.productId}
          xs={12}
          sm={6}
          md={4}
          lg={3}
        >
          <ProductSummary syncProduct={product} />
        </Grid>
      ))}
    </Grid>
  )
}

export default Page
