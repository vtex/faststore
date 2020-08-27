import React from 'react'
import { Text } from '@vtex/store-ui'

import { useItemContext } from './ItemContext'

export const ProductQuantityLabel: React.FC = () => {
  const { item } = useItemContext()

  return (
    <Text as="span" sx={{ color: 'muted1', fontSize: '1rem', fontWeight: 400 }}>
      {item.quantity} un.
    </Text>
  )
}
