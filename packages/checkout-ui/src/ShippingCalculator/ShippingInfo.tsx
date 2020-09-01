import React, { FC } from 'react'
import { Text, Flex, Box } from '@vtex/store-ui'

import { TranslateEstimate } from '../TranslateEstimate/TranslateEstimate'
import { FormattedPrice } from '../FormattedPrice/FormattedPrice'
import { slugify } from './utils/slugify'
import { DeliveryOption } from './types'

interface Props {
  option: DeliveryOption
}

export const ShippingInfo: FC<Props> = ({ option }) => {
  const optionId = slugify(option.id)

  return (
    <Flex sx={{ width: '100%' }}>
      <Box sx={{ flex: '1 1 auto' }}>
        <Box id={optionId} mb={3}>
          {option.id}
        </Box>
        <Text id={`estimate-${optionId}`} sx={{ color: 'textMuted' }}>
          <TranslateEstimate shippingEstimate={option.estimate} />
        </Text>
      </Box>
      <Box id={`price-${optionId}`} sx={{ flex: 'none' }}>
        <FormattedPrice value={option.price / 100} />
      </Box>
    </Flex>
  )
}
