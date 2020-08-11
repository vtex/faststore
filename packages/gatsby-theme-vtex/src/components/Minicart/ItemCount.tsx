import React, { FC } from 'react'
import { Box } from '@vtex/store-ui'

import { useOrderForm } from '../../hooks/useOrderForm'

const ItemCount: FC = () => {
  const orderForm = useOrderForm()
  const count = orderForm?.value?.items.length ?? 0

  return <Box variant="header-minicart-badge">{count}</Box>
}

export default ItemCount
