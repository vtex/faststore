/** @jsx jsx */
import { Breadcrumb, Card, Flex, Grid, Heading, jsx } from '@vtex/store-ui'
import { graphql } from 'gatsby'
import { FC, lazy } from 'react'

import BuyButton from '../BuyButton'
import Container from '../Container'
import OfferPreview from '../Offer/Preview'
import ProductDescription from '../ProductDescription'
import ProductDetailsImage from '../ProductDetailsImage'
import SEO from '../SEO/ProductDetails'
import SuspenseSSR from '../Suspense/SSR'
import SuspenseViewport from '../Suspense/Viewport'
import { ProductDetailsTemplate_ProductFragment } from './__generated__/ProductDetailsTemplate_product.graphql'

const productSpecificationLoader = () => import('../ProductSpecification')

const ProductSpecification = lazy(productSpecificationLoader)
const AsyncOffer = lazy(() => import('../Offer/Async'))

interface Props {
  product: ProductDetailsTemplate_ProductFragment
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
            <SuspenseSSR fallback={<OfferPreview variant="detail" />}>
              <AsyncOffer slug={linkText} variant="detail" />
            </SuspenseSSR>
            <BuyButton sku={items[0] as any} />
          </Card>
        </Grid>
        <SuspenseViewport
          fallback={null}
          preloader={productSpecificationLoader}
        >
          <ProductSpecification slug={linkText} />
        </SuspenseViewport>
        <ProductDescription slug={linkText} />
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
