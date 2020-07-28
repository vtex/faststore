import React, { FC, useMemo } from 'react'
import { Box } from 'theme-ui'

import { useNumberFormat } from '../../providers/NumberFormat'
import { findBestSeller, Item } from '../../utils/seller'
import DiscountPercentage from './DiscountPercentage'
import ListPrice from './ListPrice'
import Grid from '../material-ui-components/Grid'

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
    <Box variant={`${variant}.offer`}>
      <ListPrice variant={variant} offer={offer} />
      <Grid container xs alignItems="center">
        <Box variant={`${variant}.price`}>
          {numberFormat.format(offer.Price)}
        </Box>
        <DiscountPercentage variant={variant} offer={offer} />
      </Grid>
      <Box variant={`${variant}.availability`}>
        {offer.AvailableQuantity} units left!
      </Box>
    </Box>
  )
}

export default SyncOffer
