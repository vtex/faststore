import { Image, MinicartDrawer } from '@vtex/store-ui'
import React from 'react'
import type { MinicartDrawerProps } from '@vtex/store-ui'
import type { FC } from 'react'

import { useOrderForm } from '../../../sdk/orderForm/Providers'
import { HeaderMinicartDrawerContent } from './Content'
import { HeaderMinicartDrawerFooter } from './Footer'
import { HeaderMinicartDrawerHeader } from './Header'

const CustomMinicartDrawer: FC<MinicartDrawerProps> = ({
  isOpen,
  onClose,
  variant,
}) => {
  const { orderForm } = useOrderForm()
  const count = orderForm?.items.length ?? 0

  const customVariant = `${variant}.drawer`

  return (
    <MinicartDrawer
      variant={variant}
      isOpen={isOpen}
      placement="right"
      onClose={onClose}
      width={400}
    >
      <HeaderMinicartDrawerHeader
        onClose={onClose}
        count={count}
        variant={customVariant}
      />
      <HeaderMinicartDrawerContent
        data={orderForm.items ?? []}
        imageElement={Image}
        variant={customVariant}
      />
      <HeaderMinicartDrawerFooter variant={customVariant} />
    </MinicartDrawer>
  )
}

export default CustomMinicartDrawer
