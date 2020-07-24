/** @jsx jsx */
import { Link } from 'gatsby'
import { FC, useMemo } from 'react'
import { Card, Heading, jsx } from 'theme-ui'

import { SyncProductItem } from '../types/product'
import { findBestSeller } from '../utils/seller'
import BuyButton from './BuyButton/Sync'
import SyncOffer from './Offer/Sync'
import ProductImage from './ProductImage'

interface Props {
  syncProduct: SyncProductItem
}

export const ProductSummary: FC<Props> = ({ syncProduct }) => {
  const sku = syncProduct.items?.[0]
  const { imageUrl, imageText } = sku?.images?.[0]
  const seller = useMemo(() => sku && findBestSeller(sku), [sku])
  const offer = seller?.commertialOffer

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
        <Heading variant="summary-name" as="h3">
          {syncProduct.productName.slice(0, 12)}
        </Heading>
        <SyncOffer offer={offer} variant="summary" />
        <BuyButton sku={sku} />
      </Card>
    </Link>
  )
}
