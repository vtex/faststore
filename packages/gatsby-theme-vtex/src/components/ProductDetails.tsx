/** @jsx jsx */
import { FC, Fragment, lazy } from 'react'
import { Card, Grid, Heading, jsx } from 'theme-ui'

import { SyncProduct } from '../types/product'
import BuyButtonPreview from './BuyButton/Preview'
import ProductImage from './ProductImage'
import SEO from './SEO/ProductDetails'
import { SuspenseSSR } from './SuspenseSSR'
import OfferPreview from './Offer/Preview'

const BuyButton = lazy(() => import('./BuyButton/Async'))
const AsyncOffer = lazy(() => import('./Offer/Async'))

interface Props {
  syncProduct: SyncProduct
}

const ProductDetailsTemplate: FC<Props> = ({ syncProduct }) => {
  const { productName, productId } = syncProduct

  return (
    <Fragment>
      <SEO title={productName} productId={productId} />
      <Grid my={4} mx="auto" gap={[0, 3]} columns={[1, 2]}>
        <ProductImage
          width={500}
          height={500}
          product={syncProduct}
          lazyLoad={false} // Never lazy load image in product details
        />
        <Card>
          <Heading variant="productTitle" as="h1">
            {productName}
          </Heading>
          <SuspenseSSR fallback={<OfferPreview />}>
            <AsyncOffer productId={productId} />
          </SuspenseSSR>
          <SuspenseSSR fallback={<BuyButtonPreview />}>
            <BuyButton productId={productId} />
          </SuspenseSSR>
        </Card>
      </Grid>
    </Fragment>
  )
}

export default ProductDetailsTemplate
