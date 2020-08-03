/** @jsx jsx */
import { Link, graphql } from 'gatsby'
import { FC, Fragment } from 'react'
import { Card, Heading, jsx } from 'theme-ui'

import { SyncProductItem } from '../types/product'
import BuyButtonPreview from './BuyButton/Preview'
import BuyButton from './BuyButton/Sync'
import OfferPreview from './Offer/Preview'
import SyncOffer from './Offer/Sync'
import ProductImage from './ProductImage'

interface Props {
  syncProduct: SyncProductItem
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

export const ProductSummary: FC<Props> = ({ syncProduct }) => {
  const { imageUrl, imageText } = syncProduct.items?.[0]?.images?.[0]
  const offer = syncProduct.items?.[0]?.sellers?.[0]?.commertialOffer

  return (
    <Link
      to={
        syncProduct.slug
          ? syncProduct.slug
          : `/${(syncProduct as any).linkText}/p`
      }
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
          src={imageUrl}
          alt={imageText}
          loading="lazy" // lazy load images
        />
        <Heading variant="summary.name" as="h3">
          {syncProduct.productName.slice(0, 12)}
        </Heading>
        {!offer ? (
          <Fragment>
            <OfferPreview variant="summary" />
            <BuyButtonPreview />
          </Fragment>
        ) : (
          <Fragment>
            <SyncOffer sku={syncProduct.items[0]} variant="summary" />
            <BuyButton sku={syncProduct.items[0]} />
          </Fragment>
        )}
      </Card>
    </Link>
  )
}
