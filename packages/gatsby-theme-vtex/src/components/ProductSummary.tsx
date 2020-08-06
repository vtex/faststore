/** @jsx jsx */
import { graphql, Link } from 'gatsby'
import { FC } from 'react'
import { Card, Heading, jsx } from 'theme-ui'

import { ProductSummary_SyncProductFragment } from './__generated__/ProductSummary_syncProduct.graphql'
import BuyButton from './BuyButton'
import OfferPreview from './Offer/Preview'
import SyncOffer from './Offer/Sync'
import ProductImage from './ProductImage'

interface Props {
  product: ProductSummary_SyncProductFragment
}

export const fragment = graphql`
  fragment ProductSummary_syncProduct on VTEX_Product {
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
        commertialOffer {
          AvailableQuantity
          Price
          ListPrice
        }
      }
    }
  }
`

export const ProductSummary: FC<Props> = ({ product }) => {
  const { imageUrl, imageText } = product.items![0]!.images![0]!
  const offer = product.items?.[0]?.sellers?.[0]?.commertialOffer

  return (
    <Link
      to={`/${(product as any).linkText}/p`}
      sx={{
        textDecoration: 'none',
        color: 'text',
        flexGrow: 1,
      }}
    >
      <Card
        sx={{
          m: 'auto',
          maxWidth: 300,
        }}
      >
        <ProductImage
          width={300}
          height={300}
          src={imageUrl!}
          alt={imageText!}
          loading="lazy" // lazy load images
        />
        <Heading variant="summary.name" as="h3">
          {product.productName!.slice(0, 12)}
        </Heading>
        {!offer ? (
          <OfferPreview variant="summary" />
        ) : (
          <SyncOffer sku={product.items![0]!} variant="summary" />
        )}
        <BuyButton sku={product.items![0]!} />
      </Card>
    </Link>
  )
}
