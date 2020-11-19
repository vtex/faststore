import { Image, MinicartDrawer, MinicartDrawerProps } from '@vtex/store-ui'
import React, { FC } from 'react'

import { OrderFormContext } from '../../../sdk/orderForm/Provider'
import { useOrderForm } from '../../../sdk/orderForm/useOrderForm'
import { IMAGE_DEFAULT } from '../../../sdk/product/constants'
import { HeaderMinicartDrawerContent } from './Content'
import { HeaderMinicartDrawerFooter } from './Footer'
import { HeaderMinicartDrawerHeader } from './Header'

const useHeaderMinicartDrawerContentData = (orderForm: OrderFormContext) => {
  const data = orderForm.value?.items.map((item) => ({
    id: Number(item.uniqueId!),
    image: {
      alt: item.name!,
      src: item.imageUrls?.at1x ?? IMAGE_DEFAULT,
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
