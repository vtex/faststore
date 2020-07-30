import React, { FC } from 'react'

import { useOrderForm } from '../../providers/OrderForm'

const ItemCount: FC = () => {
  const orderForm = useOrderForm()
  const count = orderForm?.value?.items.length ?? 0

  return (
    <div
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
    </div>
  )
}

export default ItemCount
