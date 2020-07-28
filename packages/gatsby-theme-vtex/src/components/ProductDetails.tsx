import React, { FC, lazy } from 'react'

import { SyncProduct } from '../types/product'
import BuyButtonPreview from './BuyButton/Preview'
import Container from './Container'
import OfferPreview from './Offer/Preview'
import ProductImage from './ProductImage'
import SEO from './SEO/ProductDetails'
import SuspenseDelay from './SuspenseDelay'
import SuspenseSSR from './SuspenseSSR'
import Card from './material-ui-components/Card'
import Typography from './material-ui-components/Typography'
import Grid from './material-ui-components/Grid'

const BuyButton = lazy(() => import('./BuyButton/Async'))
const AsyncOffer = lazy(() => import('./Offer/Async'))

interface Props {
  syncProduct: SyncProduct
}

// TODO: Style Typography, Grid
const ProductDetailsTemplate: FC<Props> = ({ syncProduct }) => {
  const { productName, productId } = syncProduct
  const { imageUrl, imageText } = syncProduct.items?.[0]?.images?.[0]

  return (
    <Container>
      <SEO title={productName} productId={productId} />
      <Grid container>
        <Grid item xs={12} sm={6}>
          <ProductImage
            width={500}
            height={500}
            src={imageUrl}
            alt={imageText}
            loading="eager" // Never lazy load image in product details
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Card>
            <Typography component="h1">{productName}</Typography>
            <SuspenseDelay fallback={<OfferPreview variant="detail" />}>
              <AsyncOffer productId={productId} variant="detail" />
            </SuspenseDelay>
            <SuspenseSSR fallback={<BuyButtonPreview />}>
              <BuyButton productId={productId} />
            </SuspenseSSR>
          </Card>
        </Grid>
      </Grid>
    </Container>
  )
}

export default ProductDetailsTemplate
