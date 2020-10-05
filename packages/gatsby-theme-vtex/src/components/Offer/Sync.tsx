import React, { FC } from 'react'
import { Box, Flex } from '@vtex/store-ui'
import { useIntl } from '@vtex/gatsby-plugin-i18n'

import { useNumberFormat } from '../../sdk/localization/useNumberFormat'
import { useBestSeller } from '../../sdk/product/useBestSeller'
import DiscountPercentage from './DiscountPercentage'
import ListPrice from './ListPrice'

interface Seller {
  commercialOffer: {
    availableQuantity: number
    listPrice: number
    price: number
  }
}

interface SKU {
  sellers: Seller[]
}

export interface Props {
  sku: SKU
  variant?: string
}

const SyncOffer: FC<Props> = ({ sku, variant = '' }) => {
  const { formatMessage } = useIntl()
  const numberFormat = useNumberFormat() // TODO: Can we do it on the server ?
  const seller = useBestSeller(sku)
  const offer = seller?.commercialOffer

  if (!offer || offer.availableQuantity === 0) {
    return <div>{formatMessage({ id: 'offer.product-unavailable' })}</div>
  }

  return (
    <Box variant={`${variant}.offer`}>
      <ListPrice variant={variant} offer={offer} />
      <Flex sx={{ alignItems: 'center' }}>
        <Box variant={`${variant}.price`}>
          {numberFormat.format(offer.price)}
        </Box>
        <DiscountPercentage variant={variant} offer={offer} />
      </Flex>
      <Box variant={`${variant}.availability`}>
        {formatMessage(
          { id: 'offer.units-left' },
          { quantity: offer.availableQuantity }
        )}
      </Box>
    </Box>
  )
}

export default SyncOffer
