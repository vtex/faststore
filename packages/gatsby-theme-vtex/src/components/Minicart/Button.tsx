import { MinicartButton, MinicartButtonProps } from '@vtex/store-ui'
import React, { FC } from 'react'

import { useOrderForm } from '../../hooks/useOrderForm'
import MinicartButtonSvg from './ButtonSvg'

const useMinicartButtonData = () => {
  const orderForm = useOrderForm()
  const badgeValue = orderForm?.value?.items.length ?? 0

  return {
    badgeValue,
  }
}

const ItemCount: FC<MinicartButtonProps> = (props) => {
  const minicartButtonData = useMinicartButtonData()

  return (
    <MinicartButton {...minicartButtonData} {...props} aria-label="Open Cart">
      <MinicartButtonSvg />
    </MinicartButton>
  )
}

export default ItemCount
