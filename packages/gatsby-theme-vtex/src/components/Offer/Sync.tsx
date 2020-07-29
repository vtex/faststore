import React, { FC, useMemo } from 'react'
import Box from '@material-ui/core/Box'

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
    <Box style={{ marginBottom: '32px' }}>
      <ListPrice variant={variant} offer={offer} />
      <Grid container xs alignItems="center">
        <Box
          style={{
            fontSize: '1.25rem',
            fontWeight: 600,
            color: '#2e2e2e',
          }}
        >
          {numberFormat.format(offer.Price)}
        </Box>
        <DiscountPercentage variant={variant} offer={offer} />
      </Grid>
      <Box
        style={{
          fontSize: '0.875',
          marginBottom: '0.5rem',
          color: '#727273',
        }}
      >
        {offer.AvailableQuantity} units left!
      </Box>
    </Box>
  )
}

export default SyncOffer
