import { MinicartBadge } from '@vtex/store-ui'
import React, { FC } from 'react'

import { useOrderForm } from '../../sdk/orderForm/useOrderForm'

const CustomMinicartBadge: FC<{ variant?: string }> = ({ variant }) => {
  const orderForm = useOrderForm()
  const count = orderForm?.value?.items.length ?? 0

  return <MinicartBadge variant={variant} value={count} />
}

export default CustomMinicartBadge
