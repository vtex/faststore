import React, { FC } from 'react'
import { Box } from 'theme-ui'

import { useOrderForm } from '../../providers/OrderForm/controler'

const ItemCount: FC = () => {
  const { value: orderForm } = useOrderForm()

  if (!orderForm) {
    return null
  }

  return <Box variant="minicart-badge">{orderForm.items.length}</Box>
}

export default ItemCount
