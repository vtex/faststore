import { useCallback, useState } from 'react'

import { gql } from '@generated'
import type {
  OrderFormItemsQueryQuery,
  OrderFormItemsQueryQueryVariables,
} from '@generated/graphql'

import { useQuery } from '../graphql/useQuery'

const OrderFormItemsQuery = gql(`
  query OrderFormItemsQuery($orderFormId: String!) {
    orderFormItems(orderFormId: $orderFormId) {
      id
      name
      price
      listPrice
      quantity
      imageUrl
      availability
      seller
      unitMultiplier
    }
  }
`)

export type OrderFormCartItem = NonNullable<
  OrderFormItemsQueryQuery['orderFormItems']
>[number]

export function useOrderFormItems() {
  const [orderFormId, setOrderFormId] = useState<string | null>(null)

  const { data, error, isValidating } = useQuery<
    OrderFormItemsQueryQuery,
    OrderFormItemsQueryQueryVariables
  >(
    OrderFormItemsQuery,
    { orderFormId: orderFormId ?? '' },
    { doNotRun: !orderFormId }
  )

  const fetchOrderFormItems = useCallback((id: string) => {
    setOrderFormId(id)
  }, [])

  const reset = useCallback(() => setOrderFormId(null), [])

  return {
    fetchOrderFormItems,
    items: orderFormId ? (data?.orderFormItems ?? null) : null,
    isLoading: !!orderFormId && !data && !error,
    isValidating,
    error: error as Error | null,
    reset,
  }
}
