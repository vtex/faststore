import React, { FC } from 'react'
import { Text } from '@vtex/store-ui'

import { useFormattedPrice } from './useFormattedPrice'

export const FormattedPrice: FC<{ value?: number | null }> = ({ value }) => {
  const formattedPrice = useFormattedPrice(value)

  return (
    <Text color={value === 0 ? 'success' : undefined}>{formattedPrice}</Text>
  )
}
