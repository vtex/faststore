import React, { FC, useMemo } from 'react'
import { Box } from 'theme-ui'

import { useNumberFormat } from '../../providers/NumberFormat'
import { findBestSeller, Item } from '../../utils/seller'
import OfferBlocks from './OfferBlocks'

export interface Props {
  sku?: Item
  variant?: string
}

const SyncOffer: FC<Props> = ({ sku, variant = '' }) => {
  const seller = useMemo(() => sku && findBestSeller(sku), [sku])
  const offer = seller?.commertialOffer
  const numberFormat = useNumberFormat()

  const formattedListPrice = useMemo(
    () =>
      offer?.ListPrice &&
      offer?.Price === offer?.ListPrice &&
      numberFormat.format(offer?.ListPrice),
    [offer, numberFormat]
  )

  const formattedPrice = useMemo(
    () => offer && numberFormat.format(offer.Price),
    [offer, numberFormat]
  )

  if (!offer || offer.AvailableQuantity === 0) {
    return <div>Product Unavailable</div>
  }

  return (
    <Box variant={`${variant}.offer`}>
      <OfferBlocks
        offer={{
          ...offer,
          formattedPrice,
          formattedListPrice,
        }}
      />
    </Box>
  )
}

export default SyncOffer
