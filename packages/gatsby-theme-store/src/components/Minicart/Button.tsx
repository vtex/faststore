import { MinicartBadge, MinicartButton } from '@vtex/store-ui'
import React from 'react'
import type { MinicartButtonProps } from '@vtex/store-ui'
import type { FC } from 'react'

import CustomMinicartButtonSvg from './ButtonSvg'
import { useOrderForm } from '../../sdk/orderForm/useOrderForm'

const CustomMinicartButton: FC<MinicartButtonProps> = ({
  variant,
  onClick,
}) => {
  const orderForm = useOrderForm()
  const count = orderForm?.value?.items.length ?? 0

  return (
    <MinicartButton variant={variant} onClick={onClick} aria-label="Open Cart">
      <CustomMinicartButtonSvg />
      <MinicartBadge variant={variant} value={count} />
    </MinicartButton>
  )
}

export default CustomMinicartButton
