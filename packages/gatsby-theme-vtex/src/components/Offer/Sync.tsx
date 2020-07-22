import React, { FC, useMemo } from 'react'
import { Box, Flex } from 'theme-ui'

import { useNumberFormat } from '../../providers/NumberFormat'
import { findBestSeller, Item } from '../../utils/seller'
import DiscountPercentage from './DiscountPercentage'
import ListPrice from './ListPrice'

export interface Props {
  sku?: Item
  variant?: string
}

const SyncOffer: FC<Props> = ({ sku, variant = '' }) => {
  const seller = useMemo(() => sku && findBestSeller(sku), [sku])
  const offer = seller?.commertialOffer
  const numberFormat = useNumberFormat()

  if (!offer || offer.AvailableQuantity === 0) {
    return <div>Product Unavailable</div>
  }

  return (
    <>
      <Box>
        <ListPrice variant={variant} offer={offer} />
        <Flex sx={{ alignItems: 'center' }}>
          <Box variant={`${variant}-price`}>
            {numberFormat.format(offer.Price)}
          </Box>
          <DiscountPercentage variant={variant} offer={offer} />
        </Flex>
      </Box>
      <Box variant={`${variant}-availability`}>
        {offer.AvailableQuantity} units left!
      </Box>
    </>
  )
}

export default SyncOffer
