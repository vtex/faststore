import { useState, useCallback } from 'react'
import { gql } from '@vtex/gatsby-plugin-graphql'

import { useLazyQuery } from '../../../sdk/graphql/useLazyQuery'
import {
  ShippingQueryQuery,
  ShippingQueryQueryVariables,
  ShippingQuery,
} from './__generated__/ShippingQuery.graphql'

type HookProps = {
  initialPostalCode?: string
  skuId: string
  seller: string
  country: string
}

export const useShippingSimulator = ({
  initialPostalCode,
  skuId,
  seller,
  country,
}: HookProps) => {
  const [loading, setLoading] = useState(false)
  const [postalCode, setPostalCode] = useState(initialPostalCode)

  const [getShipping, { data: shipping }] = useLazyQuery<
    ShippingQueryQuery,
    ShippingQueryQueryVariables
  >({
    variables: null,
    ...ShippingQuery,
  })

  // TODO: Receive quantity from context or props
  const onSubmit = useCallback(() => {
    setLoading(true)
    getShipping({
      items: [{ id: skuId, seller, quantity: '1' }],
      country,
      postalCode,
    }).finally(() => {
      setLoading(false)
    })
  }, [postalCode, getShipping, country, seller, skuId])

  return {
    shipping,
    loading,
    postalCode,
    setPostalCode,
    isValid: postalCode?.length === 9,
    onSubmit,
  }
}

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
