import { Image, MinicartDrawer } from '@vtex/store-ui'
import React from 'react'
import type { MinicartDrawerProps } from '@vtex/store-ui'
import type { FC } from 'react'

import { useOrderForm } from '../../../sdk/orderForm/useOrderForm'
import { IMAGE_DEFAULT } from '../../../sdk/product/constants'
import { HeaderMinicartDrawerContent } from './Content'
import { HeaderMinicartDrawerFooter } from './Footer'
import { HeaderMinicartDrawerHeader } from './Header'
import type { OrderFormContext } from '../../../sdk/orderForm/Provider'

const useHeaderMinicartDrawerContentData = (orderForm: OrderFormContext) => {
  const data = orderForm.value?.items.map((item) => ({
    id: Number(item.id),
    image: {
      alt: item.name!,
      src: item.imageUrls?.at2x ?? IMAGE_DEFAULT,
    },
    name: item.name!,
    price: item.price!,
  }))

  return {
    data: data || [],
  }
}

const CustomMinicartDrawer: FC<MinicartDrawerProps> = ({
  isOpen,
  onClose,
  variant,
}) => {
  const orderForm = useOrderForm()
  const count = orderForm?.value?.items.length ?? 0
  const contentData = useHeaderMinicartDrawerContentData(orderForm)

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
        {...contentData}
        imageElement={Image}
        variant={customVariant}
      />
      <HeaderMinicartDrawerFooter variant={customVariant} />
    </MinicartDrawer>
  )
}

export default CustomMinicartDrawer
