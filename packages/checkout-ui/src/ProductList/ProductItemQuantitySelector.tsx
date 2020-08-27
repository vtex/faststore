import React, { FC } from 'react'
import { Box } from '@vtex/store-ui'

import { QuantitySelector } from './components/QuantitySelector'
import { useItemContext } from './ItemContext'
import { AVAILABLE } from './constants/Availability'
import { opaque } from './utils/opaque'

const MAX_ITEM_QUANTITY = 99999

export const ProductItemQuantitySelector: FC = () => {
  const { item, loading, onQuantityChange } = useItemContext()

  if (loading) {
    return <>loading...</>
  }

  return (
    <Box sx={opaque(item.availability)}>
      <QuantitySelector
        id={item.id}
        value={item.quantity}
        maxValue={MAX_ITEM_QUANTITY}
        onChange={onQuantityChange}
        disabled={item.availability !== AVAILABLE}
      />
    </Box>
  )
}
