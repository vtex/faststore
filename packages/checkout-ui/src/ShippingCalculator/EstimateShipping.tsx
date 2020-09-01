import React, { useState, FC } from 'react'
import { components, helpers } from '@vtex/address-form'

import { PostalCode } from './PostalCode'
import { ShippingResult } from './ShippingResult'
import { newAddress } from './utils/address'
import {
  CheckoutAddress,
  Address,
  DeliveryOption,
  AddressWithValidation,
} from './types'

const { AddressContainer, AddressRules, StyleguideInput } = components
const { addValidation, removeValidation } = helpers

interface CustomProps {
  canEditData: boolean
  insertAddress: (address: CheckoutAddress) => Promise<unknown>
  selectedAddress: Address
  deliveryOptions: DeliveryOption[]
  countries: string[]
  selectDeliveryOption: (option: string) => void
  numberOfItems: number
  numberOfUnavailableItems: number
}

export const EstimateShipping: FC<CustomProps> = ({
  canEditData,
  insertAddress,
  selectedAddress,
  deliveryOptions = [],
  countries = [],
  selectDeliveryOption,
  numberOfItems,
  numberOfUnavailableItems,
}) => {
  const [address, setAddress] = useState<AddressWithValidation>(
    addValidation(
      selectedAddress
        ? newAddress(selectedAddress)
        : newAddress({ country: 'BRA' })
    )
  )

  const [loading, setLoading] = useState<boolean>(false)

  const [showResult, setShowResult] = useState<boolean>(
    selectedAddress && !!selectedAddress.postalCode
  )

  const handleAddressChange = (updatedAddress: AddressWithValidation) => {
    setAddress(updatedAddress)
  }

  const handleSubmit = () => {
    const addressWithoutValidation = removeValidation(address)
    const postalCodeValid = address?.postalCode?.valid

    if (!postalCodeValid) {
      return
    }

    setLoading(true)

    insertAddress(addressWithoutValidation).then(() => {
      setShowResult(true)
      setLoading(false)
    })
  }

  return (
    <AddressRules
      country={address.country && address.country.value}
      shouldUseIOFetching
    >
      <AddressContainer
        address={address}
        Input={StyleguideInput}
        onChangeAddress={handleAddressChange}
        shouldHandleAddressChangeOnMount
      >
        {showResult ? (
          <ShippingResult
            canEditData={canEditData}
            address={address}
            options={deliveryOptions}
            setShowResult={setShowResult}
            selectDeliveryOption={selectDeliveryOption}
            numberOfItems={numberOfItems}
            numberOfUnavailableItems={numberOfUnavailableItems}
          />
        ) : (
          <PostalCode
            loading={loading}
            handleSubmit={handleSubmit}
            countries={countries}
          />
        )}
      </AddressContainer>
    </AddressRules>
  )
}
