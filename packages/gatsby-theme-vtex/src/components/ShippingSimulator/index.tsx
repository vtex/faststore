import React, { FC, useState, useCallback } from 'react'
import { gql } from '@vtex/gatsby-plugin-graphql'
import { helpers } from '@vtex/address-form'

import ShippingSimulator from './ShippingSimulator'
import { getNewAddress } from './utils'

const { addValidation } = helpers

export const query = gql`
  query ShippingQuery(
    $items: [VTEX_ShippingItem]
    $postalCode: String
    $country: String
  ) {
    vtex {
      shippingSLA(items: $items, postalCode: $postalCode, country: $country) {
        countries
        deliveryOptions {
          estimate
          price
        }
      }
    }
  }
`

type Props = {
  skuId: string
  seller: string
  country: string
  initialPostalCode?: string
  variant: string
}

// TODO: Type address
const useAddressState = (country: string, postalCode?: string) => {
  const [address, setAddress] = useState(
    addValidation(getNewAddress(country, postalCode))
  )

  const [isValid, setIsValid] = useState(!!postalCode)

  const updateAddress = (newAddress: any) => {
    const updatedAddress = {
      ...address,
      ...newAddress,
    }

    // eslint-disable-next-line no-console
    console.log({ updatedAddress })
    setAddress(updatedAddress)
    setIsValid(updatedAddress.postalCode.valid)
  }

  return { address, updateAddress, isValid }
}

const ShippingSimulatorWrapper: FC<Props> = ({
  skuId,
  seller,
  country,
  initialPostalCode,
  variant,
}) => {
  const [shipping, setShipping] = useState(null)
  const [loading, setLoading] = useState(false)

  const { address, updateAddress, isValid } = useAddressState(
    country,
    initialPostalCode
  )

  const handleCalculateShipping = useCallback(() => {
    // eslint-disable-next-line no-console
    console.log(`Calculating shipping for ${address}`)

    setShipping(null)
    setLoading(false)
  }, [setShipping, setLoading, address])

  return (
    <ShippingSimulator
      variant={`${variant}.shippingSimulator`}
      skuId={skuId}
      seller={seller}
      country={country}
      loading={loading}
      address={address}
      isValid={isValid}
      shipping={shipping}
      onAddress={updateAddress}
      onCalculateShipping={handleCalculateShipping}
    />
  )
}

export default ShippingSimulatorWrapper
