import React, { FC } from 'react'

import { useOrderForm } from '../providers/OrderForm/controler'

const ItemCount: FC = () => {
  const { value: orderForm } = useOrderForm()

  if (!orderForm) {
    return <>0</>
  }

  return <>{orderForm.items.length}</>
}

export default ItemCount
