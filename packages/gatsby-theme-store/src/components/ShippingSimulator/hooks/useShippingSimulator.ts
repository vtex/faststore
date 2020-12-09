import { gql } from '@vtex/gatsby-plugin-graphql'
import { useCallback, useEffect, useState } from 'react'

import { useLazyQuery } from '../../../sdk/graphql/useLazyQuery'
import { ShippingQuery } from './__generated__/ShippingQuery.graphql'
import type {
  ShippingQueryQuery,
  ShippingQueryQueryVariables,
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
  }, [getShipping, skuId, seller, quantity, country, postalCode])

  /**
   * This effect is responsible for trigerring a shipping simulation
   * whenever the selected quantity changes.
   *
   * Here we are explictly disabling the react-hooks/exhaustive-deps rule.
   * Adding the other recommended deps may trigger an update loop.
   */
  useEffect(() => {
    !loading && postalCode && onSubmit()
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
