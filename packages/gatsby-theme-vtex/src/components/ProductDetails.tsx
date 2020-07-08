/** @jsx jsx */
import { FC, Fragment } from 'react'
import { Card, Grid, Heading, jsx } from 'theme-ui'

import { SyncProduct } from '../types/product'
import { BuyButton } from './BuyButton'
import { Offer } from './Offer'
import ProductImage from './ProductImage'
import SEO from './SEO/ProductDetails'

interface Props {
  syncProduct: SyncProduct
}

const ProductDetailsTemplate: FC<Props> = ({ syncProduct }) => {
  const { productName } = syncProduct

  return (
    <Fragment>
      <SEO title={productName} />
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
          <Offer />
          <BuyButton skuId={syncProduct?.items[0].itemId} />
        </Card>
      </Grid>
    </Fragment>
  )
}

export default ProductDetailsTemplate
