/** @jsx jsx */
import { graphql } from 'gatsby'
import { FC, lazy } from 'react'
import { Card, Grid, Heading, Breadcrumb, Flex, jsx } from '@vtex/store-ui'

import { ProductDetailsTemplate_productFragment } from './__generated__/ProductDetailsTemplate_product.graphql'
import OfferPreview from '../Offer/Preview'
import ProductDetailsImage from '../ProductDetailsImage'
import SEO from '../SEO/ProductDetails'
import SuspenseDelay from '../Suspense/Delay'
import BuyButton from '../BuyButton'
import Container from '../Container'

const AsyncOffer = lazy(() => import('../Offer/Async'))

interface Props {
  product: ProductDetailsTemplate_productFragment
}

const ProductDetailsTemplate: FC<Props> = ({ product }) => {
  const {
    categoryTree: breadcrumb = [],
    productName,
    linkText,
    items,
  } = product as any

  const [{ images }] = items
  const [{ imageUrl, imageText }] = images

  return (
    <Flex variant="productPage.container">
      <Container>
        <SEO title={productName} slug={linkText} />
        <Breadcrumb breadcrumb={breadcrumb} type="PRODUCT" />
        <Grid my={4} mx="auto" gap={[0, 3]} columns={[1, 2]}>
          <ProductDetailsImage
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
    </Flex>
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
