import { Link } from 'gatsby'
import React, { FC, Fragment } from 'react'

import { SyncProductItem } from '../types/product'
import BuyButtonPreview from './BuyButton/Preview'
import BuyButton from './BuyButton/Sync'
import OfferPreview from './Offer/Preview'
import SyncOffer from './Offer/Sync'
import ProductImage from './ProductImage'
import Card from './material-ui-components/Card'
import Typography from './material-ui-components/Typography'

interface Props {
  syncProduct: SyncProductItem
}

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
        style={{
          margin: 'auto',
          maxWidth: 300,
        }}
      >
        <ProductImage
          width={300}
          height={300}
          src={imageUrl}
          alt={imageText}
          loading="lazy"
        />
        <Typography component="h3">
          {syncProduct.productName.slice(0, 12)}
        </Typography>
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
