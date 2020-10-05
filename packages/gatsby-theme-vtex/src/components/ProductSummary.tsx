/** @jsx jsx */
import { graphql } from 'gatsby'
import { FC } from 'react'
import { Card, Heading, jsx, LocalizedLink } from '@vtex/store-ui'

import { ProductSummary_ProductFragment } from './__generated__/ProductSummary_product.graphql'
import BuyButton from './BuyButton'
import ProductSummaryImage from './ProductSummaryImage'

interface Props {
  product: ProductSummary_ProductFragment
  loading?: 'lazy' | 'eager'
}

const ProductSummary: FC<Props> = ({ product, loading = 'lazy' }) => {
  const { linkText, items, productName } = product as any
  const [{ imageUrl, imageText }] = items[0].images

  return (
    <LocalizedLink
      state={{ fromSummary: true }}
      to={`/${linkText}/p`}
      sx={{
        textDecoration: 'none',
        color: 'text',
        flexGrow: 1,
      }}
    >
      <Card
        variant="summary.container"
        sx={{
          m: 'auto',
          maxWidth: 300,
        }}
      >
        <ProductSummaryImage
          src={imageUrl}
          alt={imageText ?? 'Product Image'}
          loading={loading}
        />
        <Heading variant="summary.name" as="h3">
          {productName.slice(0, 12)}
        </Heading>

        <BuyButton sku={items[0]} />
      </Card>
    </LocalizedLink>
  )
}

export const fragment = graphql`
  fragment ProductSummary_product on VTEX_Product {
    productId
    productName
    description
    linkText
    items {
      itemId
      images {
        imageUrl
        imageText
      }
      sellers {
        sellerId
        commercialOffer: commertialOffer {
          availableQuantity: AvailableQuantity
          price: Price
          listPrice: ListPrice
        }
      }
    }
  }
`

export default ProductSummary
