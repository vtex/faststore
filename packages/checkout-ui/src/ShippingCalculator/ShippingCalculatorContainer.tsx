import React, { FC } from 'react'
import { Heading, Flex } from '@vtex/store-ui'

import { Address } from './types'
import { ShippingContextProvider } from './ShippingContext'

interface DeliveryOption {
  id: string
  price: number
  estimate: string
  isSelected: boolean
}

interface ContainerProps {
  canEditData: boolean
  countries: string[]
  deliveryOptions: DeliveryOption[]
  insertAddress: (address: any) => Promise<void>
  loading: boolean
  numberOfItems?: number
  numberOfUnavailableItems?: number
  selectDeliveryOption: (option: string) => void
  selectedAddress: Address
  title: string
}

export const ShippingCalculatorContainer: FC<ContainerProps> = ({
  children,
  canEditData = false,
  countries = [],
  deliveryOptions = [],
  insertAddress,
  loading,
  numberOfItems = 0,
  numberOfUnavailableItems = 0,
  selectDeliveryOption,
  selectedAddress,
  title,
}) => {
  return (
    <ShippingContextProvider
      canEditData={canEditData}
      countries={countries}
      deliveryOptions={deliveryOptions}
      insertAddress={insertAddress}
      loading={loading}
      numberOfItems={numberOfItems}
      numberOfUnavailableItems={numberOfUnavailableItems}
      selectDeliveryOption={selectDeliveryOption}
      selectedAddress={selectedAddress}
    >
      <Flex sx={{ flexDirection: 'column', color: 'text' }}>
        <Heading as="h5" sx={{ fontSize: 3, fontWeight: 400 }} mb={3}>
          {title}
        </Heading>
        {children}
      </Flex>
    </ShippingContextProvider>
  )
}
