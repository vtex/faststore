import React, { FC } from 'react'

import ShippingSimulator from './ShippingSimulator'
import { useShippingSimulator } from './hooks/useShippingSimulator'

type Props = {
  skuId: string
  seller: string
  country: string
  initialPostalCode?: string
  variant: string
  quantity: number
}

const ShippingSimulatorWrapper: FC<Props> = ({
  skuId,
  seller,
  country,
  initialPostalCode,
  variant,
  quantity,
}) => {
  const {
    shipping,
    postalCode,
    setPostalCode,
    isValid,
    loading,
    onSubmit,
  } = useShippingSimulator({
    initialPostalCode,
    skuId,
    seller,
    country,
    quantity,
  })

  return (
    <ShippingSimulator
      variant={`shippingSimulator.${variant}`}
      skuId={skuId}
      seller={seller}
      country={country}
      loading={loading}
      postalCode={postalCode}
      onPostalCode={setPostalCode}
      isValid={isValid}
      shipping={shipping}
      onCalculateShipping={onSubmit}
    />
  )
}

export default ShippingSimulatorWrapper
