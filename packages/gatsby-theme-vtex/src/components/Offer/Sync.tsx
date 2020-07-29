import React, { FC, useMemo } from 'react'
import { Box } from 'theme-ui'

import { findBestSeller, Item } from '../../utils/seller'
import OfferBlocks from './OfferBlocks'

export interface Props {
  sku?: Item
  variant?: string
}

const SyncOffer: FC<Props> = ({ sku, variant = '' }) => {
  const seller = useMemo(() => sku && findBestSeller(sku), [sku])
  const offer = seller?.commertialOffer

  if (!offer || offer.AvailableQuantity === 0) {
    return <div>Product Unavailable</div>
  }

  return (
    <Box variant={`${variant}.offer`}>
      <OfferBlocks variant={variant} offer={offer} />
    </Box>
  )
}

export default SyncOffer
