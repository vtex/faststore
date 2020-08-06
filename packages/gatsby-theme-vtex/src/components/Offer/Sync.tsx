import { graphql } from 'gatsby'
import React, { FC } from 'react'
import { Box, Flex } from 'theme-ui'

import { useNumberFormat } from '../../providers/NumberFormat'
import { SyncOffer_SkuFragment } from './__generated__/SyncOffer_sku.graphql'
import DiscountPercentage from './DiscountPercentage'
import ListPrice from './ListPrice'
import { useBestSeller } from '../../hooks/useBestSeller'

export interface Props {
  sku?: SyncOffer_SkuFragment
  variant?: string
}

const SyncOffer: FC<Props> = ({ sku, variant = '' }) => {
  const seller = useBestSeller(sku!)
  const offer = seller?.commertialOffer
  const numberFormat = useNumberFormat()

  if (!offer || offer.AvailableQuantity === 0) {
    return <div>Product Unavailable</div>
  }

  return (
    <Box variant={`${variant}.offer`}>
      <ListPrice variant={variant} offer={offer as any} />
      <Flex sx={{ alignItems: 'center' }}>
        <Box variant={`${variant}.price`}>
          {numberFormat.format(offer.Price!)}
        </Box>
        <DiscountPercentage variant={variant} offer={offer as any} />
      </Flex>
      <Box variant={`${variant}.availability`}>
        {offer.AvailableQuantity} units left!
      </Box>
    </Box>
  )
}

export const fragment = graphql`
  fragment SyncOffer_sku on VTEX_SKU {
    ...UseBestSeller_sku
  }
`

export default SyncOffer
