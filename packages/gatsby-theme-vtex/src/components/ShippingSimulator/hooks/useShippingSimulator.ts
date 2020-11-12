import { useState, useCallback, useEffect } from 'react'
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
  quantity?: number
}

export const useShippingSimulator = ({
  initialPostalCode,
  skuId,
  seller,
  country,
  quantity,
}: HookProps) => {
  const [loading, setLoading] = useState(false)
  const [postalCode, setPostalCode] = useState(initialPostalCode ?? '')

  const [getShipping, { data: shipping }] = useLazyQuery<
    ShippingQueryQuery,
    ShippingQueryQueryVariables
  >({
    variables: null,
    ...ShippingQuery,
  })

  const onSubmit = useCallback(() => {
    setLoading(true)
    getShipping({
      items: [{ id: skuId, seller, quantity: quantity?.toString() ?? '1' }],
      country,
      postalCode,
    }).finally(() => {
      setLoading(false)
    })
  }, [postalCode, getShipping, country, seller, skuId])

  // Recalculates the shipping information if the product quantity changes
  useEffect(() => {
    !loading && postalCode && onSubmit()
  }, [quantity])

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
