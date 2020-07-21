/** @jsx jsx */
import { FC } from 'react'
import { Link } from 'gatsby'
import { Card, Heading, jsx } from 'theme-ui'

import SyncOffer from './Offer/Sync'
import ProductImage from './ProductImage'
import { SyncProductItem } from '../types/product'
import BuyButton from './BuyButton/Sync'

interface Props {
  syncProduct: SyncProductItem
}

export const ProductSummary: FC<Props> = ({ syncProduct }) => {
  const { imageUrl, imageText } = syncProduct.items?.[0]?.images?.[0]

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
      }}
    >
      <Card
        sx={{
          m: 'auto',
          maxWidth: 300,
          textAlign: 'center',
        }}
      >
        <ProductImage
          width={300}
          height={300}
          src={imageUrl}
          alt={imageText}
          loading="lazy" // lazy load images
        />
        <Heading variant="shellProductName" as="h3">
          {syncProduct.productName.slice(0, 12)}
        </Heading>
        <SyncOffer sku={syncProduct.items[0]} />
        <BuyButton sku={syncProduct.items[0]} />
      </Card>
    </Link>
  )
}
