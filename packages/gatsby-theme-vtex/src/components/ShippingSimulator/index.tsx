import React, { FC, useState, useCallback } from 'react'
import { gql } from '@vtex/gatsby-plugin-graphql'
import { helpers } from '@vtex/address-form'

import ShippingSimulator from './ShippingSimulator'
import { useLazyQuery } from '../../sdk/graphql/useLazyQuery'
import { getNewAddress } from './utils'
import {
  ShippingQuery,
  ShippingQueryQuery,
  ShippingQueryQueryVariables,
} from './__generated__/ShippingQuery.graphql'

const { addValidation } = helpers

export const query = gql`
  query ShippingQuery(
    $items: [VTEX_ShippingItem]
    $postalCode: String
    $country: String
  ) {
    vtex {
      shippingSLA(items: $items, postalCode: $postalCode, country: $country) {
        deliveryOptions {
          id
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
  const [loading, setLoading] = useState(false)

  const [getShipping, { data }] = useLazyQuery<
    ShippingQueryQuery,
    ShippingQueryQueryVariables
  >({
    variables: null,
    ...ShippingQuery,
  })

  const { address, updateAddress, isValid } = useAddressState(
    country,
    initialPostalCode
  )

  // TODO: Receive quantity from context or props
  const handleCalculateShipping = useCallback(() => {
    getShipping({
      items: [{ id: skuId, seller, quantity: '1' }],
      country,
      postalCode: address.postalCode.value,
    })

    setLoading(false)
  }, [setLoading, address, getShipping, country, seller, skuId])

  return (
    <ShippingSimulator
      variant={`${variant}.shippingSimulator`}
      skuId={skuId}
      seller={seller}
      country={country}
      loading={loading}
      address={address}
      isValid={isValid}
      shipping={data}
      onAddress={updateAddress}
      onCalculateShipping={handleCalculateShipping}
    />
  )
}

export default ShippingSimulatorWrapper
