import React, { FC } from 'react'
import { Box, Flex, Text } from '@vtex/store-ui'

import { ShippingQueryQuery } from './__generated__/ShippingQuery.graphql'

type Props = {
  shipping: ShippingQueryQuery | null
  variant: string
}

const ShippingTable: FC<Props> = ({ shipping, variant }) => {
  return (
    <Box variant={`${variant}.shippingTable`}>
      {shipping?.vtex.shippingSLA?.deliveryOptions?.map((option) => {
        if (!option?.estimate || !option.id) return null

        const shippingOptionProps = {
          id: option.id,
          price: option.price ?? 0,
          estimate: option.estimate,
        }

        return (
          <ShippingOption
            key={shippingOptionProps.id}
            {...shippingOptionProps}
          />
        )
      })}
    </Box>
  )
}

type ShippingOptionProps = {
  id: string
  estimate: string
  price: number
}

const ShippingOption: FC<ShippingOptionProps> = ({ id, price, estimate }) => {
  return (
    <Flex sx={{ width: '100%', lineHeight: 1.15 }}>
      <Box sx={{ flex: '1 1 auto' }}>
        <Box mb={2}>{id}</Box>
        <Text sx={{ color: 'textMuted' }}>
          {estimate}
          {/* <TranslateEstimate shippingEstimate={option.estimate} /> */}
        </Text>
      </Box>
      <Box sx={{ flex: 'none' }}>
        {price}
        {/* <FormattedPrice value={option.price / 100} /> */}
      </Box>
    </Flex>
  )
}

export default ShippingTable
