import React, { createContext, useContext, FC } from 'react'

import { DeliveryOption, CheckoutAddress, Address } from './types'

export type InsertAddressResult = {
  shipping: { deliveryOptions: DeliveryOption[] }
}

interface Context {
  canEditData: boolean
  countries: string[]
  deliveryOptions: DeliveryOption[]
  insertAddress: (address: CheckoutAddress) => Promise<void>
  loading: boolean
  numberOfItems: number
  numberOfUnavailableItems: number
  selectDeliveryOption: (option: string) => void
  selectedAddress: Address
}

const ShippingContext = createContext<Context | undefined>(undefined)

export const useShipping = () => {
  const context = useContext(ShippingContext)

  if (context === undefined) {
    throw new Error('useShipping must be used within a Shipping component')
  }

  return context
}

export const ShippingContextProvider: FC<Context> = ({
  canEditData,
  countries,
  deliveryOptions,
  insertAddress,
  loading,
  numberOfItems,
  numberOfUnavailableItems,
  selectDeliveryOption,
  selectedAddress,
  children,
}) => {
  return (
    <ShippingContext.Provider
      value={{
        canEditData,
        countries,
        deliveryOptions,
        insertAddress,
        loading,
        numberOfItems,
        numberOfUnavailableItems,
        selectDeliveryOption,
        selectedAddress,
      }}
    >
      {children}
    </ShippingContext.Provider>
  )
}
