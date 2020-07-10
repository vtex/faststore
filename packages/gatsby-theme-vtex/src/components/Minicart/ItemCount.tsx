import React, { FC } from 'react'
import { Box } from 'theme-ui'

import { useOrderForm } from '../../providers/OrderForm/controler'

const ItemCount: FC = () => {
  const { value: orderForm } = useOrderForm()
  const count = orderForm?.items.length ?? 0
  return <Box variant="minicart-badge">{count}</Box>
}

export default ItemCount
