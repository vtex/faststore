/** @jsx jsx */
import { graphql } from 'gatsby'
import { FC, lazy } from 'react'
import { Card, Grid, Heading, jsx } from 'theme-ui'

import { ProductDetailsTemplate_ProductFragment } from './__generated__/ProductDetailsTemplate_product.graphql'
import BuyButtonPreview from './BuyButton/Preview'
import Container from './Container'
import OfferPreview from './Offer/Preview'
import ProductImage from './ProductImage'
import SEO from './SEO/ProductDetails'
import SuspenseDelay from './SuspenseDelay'
import SuspenseSSR from './SuspenseSSR'

const BuyButton = lazy(() => import('./BuyButton/Async'))
const AsyncOffer = lazy(() => import('./Offer/Async'))

export const query = graphql`
  fragment ProductDetailsTemplate_product on VTEX_Product {
    productName
    linkText
    items {
      images {
        imageUrl
        imageText
      }
    }
  }
`

interface Props {
  product: ProductDetailsTemplate_ProductFragment
}

const ProductDetailsTemplate: FC<Props> = ({ product }) => {
  const { productName, linkText, items } = product
  const { imageUrl, imageText } = items![0]!.images![0]!

  return (
    <Container>
      <SEO title={productName!} slug={linkText!} />
      <Grid my={4} mx="auto" gap={[0, 3]} columns={[1, 2]}>
        <ProductImage
          width={500}
          height={500}
          src={imageUrl!}
          alt={imageText!}
          loading="eager" // Never lazy load image in product details
        />
        <Card>
          <Heading variant="productTitle" as="h1">
            {productName}
          </Heading>
          <SuspenseDelay fallback={<OfferPreview variant="detail" />}>
            <AsyncOffer slug={linkText!} variant="detail" />
          </SuspenseDelay>
          <SuspenseSSR fallback={<BuyButtonPreview />}>
            <BuyButton slug={linkText!} />
          </SuspenseSSR>
        </Card>
      </Grid>
    </Container>
  )
}

export default ProductDetailsTemplate
