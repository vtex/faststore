import React, { FC } from 'react'
import Box from '@material-ui/core/Box'

import { useOrderForm } from '../../providers/OrderForm'

const ItemCount: FC = () => {
  const orderForm = useOrderForm()
  const count = orderForm?.value?.items.length ?? 0

  return (
    <Box
      style={{
        background: '#f71963',
        borderRadius: '100%',
        height: 16,
        position: 'absolute',
        width: 16,
        top: 0,
        right: 0,
        fontSize: 10,
      }}
    >
      {count}
    </Box>
  )
}

export default ItemCount
