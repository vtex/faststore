import React, { FC, lazy } from 'react'
import { makeStyles } from '@material-ui/core'
import type { Theme } from '@material-ui/core'

import { SyncProduct } from '../types/product'
import BuyButtonPreview from './BuyButton/Preview'
import Container from './Container'
import OfferPreview from './Offer/Preview'
import ProductImage from './ProductImage'
import SEO from './SEO/ProductDetails'
import SuspenseDelay from './SuspenseDelay'
import SuspenseSSR from './SuspenseSSR'
import Typography from './material-ui-components/Typography'
import Grid from './material-ui-components/Grid'

const BuyButton = lazy(() => import('./BuyButton/Async'))
const AsyncOffer = lazy(() => import('./Offer/Async'))

interface Props {
  syncProduct: SyncProduct
}

const useStyles = makeStyles((theme: Theme) => ({
  productName: {
    fontWeight: theme.typography.fontWeightBold,
    marginBottom: theme.spacing(4),
  },
  gridContainer: {
    margin: `${theme.spacing(3)}px auto`,
    maxWidth: '100%',
  },
}))

// TODO: Style Typography, Grid
const ProductDetailsTemplate: FC<Props> = ({ syncProduct }) => {
  const { productName, productId } = syncProduct
  const { imageUrl, imageText } = syncProduct.items?.[0]?.images?.[0]
  const classes = useStyles()

  return (
    <Container>
      <SEO title={productName} productId={productId} />
      <Grid className={classes.gridContainer} container spacing={5}>
        <Grid
          container
          item
          xs={12}
          sm={6}
          justify="center"
          alignItems="center"
        >
          <ProductImage
            width={500}
            height={500}
            src={imageUrl}
            alt={imageText}
            loading="eager" // Never lazy load image in product details
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography
            classes={{
              root: classes.productName,
            }}
            variant="h4"
            component="h1"
          >
            {productName}
          </Typography>
          <SuspenseDelay fallback={<OfferPreview variant="detail" />}>
            <AsyncOffer productId={productId} variant="detail" />
          </SuspenseDelay>
          <SuspenseSSR fallback={<BuyButtonPreview />}>
            <BuyButton productId={productId} />
          </SuspenseSSR>
        </Grid>
      </Grid>
    </Container>
  )
}

export default ProductDetailsTemplate
