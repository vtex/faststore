import React, { FC, useState, useCallback } from 'react'
import { gql } from '@vtex/gatsby-plugin-graphql'

import ShippingSimulator from './ShippingSimulator'
import { useLazyQuery } from '../../sdk/graphql/useLazyQuery'
import {
  ShippingQuery,
  ShippingQueryQuery,
  ShippingQueryQueryVariables,
} from './__generated__/ShippingQuery.graphql'

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

const usePostalCode = (initialValue: string) => {
  const [postalCode, setPostalCode] = useState(initialValue)

  return { postalCode, setPostalCode, isValid: postalCode?.length === 8 }
}

const ShippingSimulatorWrapper: FC<Props> = ({
  skuId,
  seller,
  country,
  initialPostalCode,
  variant,
}) => {
  const [loading, setLoading] = useState(false)
  const { setPostalCode, postalCode, isValid } = usePostalCode(
    initialPostalCode ?? ''
  )

  const [getShipping, { data }] = useLazyQuery<
    ShippingQueryQuery,
    ShippingQueryQueryVariables
  >({
    variables: null,
    ...ShippingQuery,
  })

  // TODO: Receive quantity from context or props
  const handleCalculateShipping = useCallback(() => {
    setLoading(true)
    getShipping({
      items: [{ id: skuId, seller, quantity: '1' }],
      country,
      postalCode,
    }).finally(() => {
      setLoading(false)
    })
  }, [postalCode, getShipping, country, seller, skuId])

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
      shipping={data}
      onCalculateShipping={handleCalculateShipping}
    />
  )
}

export default ShippingSimulatorWrapper
