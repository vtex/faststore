import React, { FC } from 'react'

import { useOrderForm } from '../providers/OrderForm/controler'

const ItemCount: FC = () => {
  const { orderForm } = useOrderForm()
  return <>{orderForm.items.length}</>
}

export default ItemCount
