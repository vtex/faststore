/** @jsx jsx */
import { graphql } from 'gatsby'
import { FC, lazy } from 'react'
import { Card, Grid, Heading, jsx } from '@vtex/store-ui'

import { ProductDetailsTemplate_ProductFragment } from './__generated__/ProductDetailsTemplate_product.graphql'
import Container from './Container'
import OfferPreview from './Offer/Preview'
import ProductImage from './ProductImage'
import SEO from './SEO/ProductDetails'
import SuspenseDelay from './SuspenseDelay'
import BuyButton from './BuyButton'

const AsyncOffer = lazy(() => import('./Offer/Async'))

interface Props {
  product: ProductDetailsTemplate_ProductFragment
}

const ProductDetailsTemplate: FC<Props> = ({ product }) => {
  const { productName, linkText, items } = product as any
  const { imageUrl, imageText } = items[0].images[0]

  return (
    <Container>
      <SEO title={productName} slug={linkText} />
      <Grid my={4} mx="auto" gap={[0, 3]} columns={[1, 2]}>
        <ProductImage
          width={500}
          height={500}
          src={imageUrl}
          alt={imageText}
          loading="eager" // Never lazy load image in product details
        />
        <Card>
          <Heading variant="productTitle" as="h1">
            {productName}
          </Heading>
          <SuspenseDelay fallback={<OfferPreview variant="detail" />}>
            <AsyncOffer slug={linkText} variant="detail" />
          </SuspenseDelay>
          <BuyButton sku={items[0] as any} />
        </Card>
      </Grid>
    </Container>
  )
}

export const query = graphql`
  fragment ProductDetailsTemplate_product on VTEX_Product {
    productName
    linkText
    items {
      images {
        imageUrl
        imageText
      }
      sellers {
        sellerId
        commertialOffer {
          AvailableQuantity
          Price
        }
      }
    }
  }
`

export default ProductDetailsTemplate
