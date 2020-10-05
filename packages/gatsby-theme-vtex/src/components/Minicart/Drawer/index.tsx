import {
  AspectImage,
  MinicartDrawer,
  MinicartDrawerProps,
} from '@vtex/store-ui'
import React, { FC } from 'react'

import { useOrderForm } from '../../../sdk/orderForm/useOrderForm'
import { useCurrency } from '../../../sdk/localization/useCurrency'
import { OrderFormContext } from '../../../sdk/orderForm/Provider'
import { IMAGE_DEFAULT } from '../../../sdk/product/constants'
import { HeaderMinicartDrawerContent } from './Content'
import { HeaderMinicartDrawerFooter } from './Footer'
import { HeaderMinicartDrawerHeader } from './Header'

const useHeaderMinicartDrawerContentData = (orderForm: OrderFormContext) => {
  const data = orderForm.value?.items.map((item) => ({
    id: item.uniqueId!,
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
  const [currency] = useCurrency()
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
        imageElement={AspectImage}
        variant={customVariant}
        currency={currency}
      />
      <HeaderMinicartDrawerFooter
        currency={currency}
        variant={customVariant}
        total={orderForm.value?.value}
        subtotal={orderForm.value?.value}
      />
    </MinicartDrawer>
  )
}

export default CustomMinicartDrawer
