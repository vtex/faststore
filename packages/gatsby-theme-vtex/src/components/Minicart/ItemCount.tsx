import React, { FC } from 'react'
import { Box } from 'theme-ui'

import { useOrderForm } from '../../providers/OrderForm'

const ItemCount: FC = () => {
  const orderForm = useOrderForm()
  const count = orderForm?.value?.items.length ?? 0

  return <Box variant="minicart-badge">{count}</Box>
}

export default ItemCount
