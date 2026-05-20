import { useCallback, useState } from 'react'

import { gql } from '@generated'
import type {
  OrderEntryOperationQueryQuery,
  OrderEntryOperationQueryQueryVariables,
  StartOrderEntryOperationMutationMutation,
  StartOrderEntryOperationMutationMutationVariables,
} from '@generated/graphql'

import { useLazyQuery } from '../graphql/useLazyQuery'
import { useQuery } from '../graphql/useQuery'

const StartOrderEntryOperationMutation = gql(`
  mutation StartOrderEntryOperationMutation($data: IOrderEntryOperation!) {
    startOrderEntryOperation(data: $data) {
      operationId
    }
  }
`)

const OrderEntryOperationQuery = gql(`
  query OrderEntryOperationQuery($operationId: String!) {
    orderEntryOperation(operationId: $operationId) {
      status
      entityId
      message
      missingItems {
        itemId
        itemName
        reason
      }
    }
  }
`)

const TERMINAL_STATUSES = new Set(['SUCCESS', 'PARTIAL_SUCCESS', 'FAILED'])

export type OrderEntryOperationStatus = NonNullable<
  OrderEntryOperationQueryQuery['orderEntryOperation']
>

export type UseOrderEntryOperationReturn = {
  startOperation: (data: {
    objectKey: string
    orderFormId: string
    sessionToken?: string
  }) => Promise<void>
  status: OrderEntryOperationStatus | null
  isLoading: boolean
  error: Error | null
  reset: () => void
}

export function useOrderEntryOperation(): UseOrderEntryOperationReturn {
  const [operationId, setOperationId] = useState<string | null>(null)

  const [startOp, { isValidating: isStarting, error: startError }] =
    useLazyQuery<
      StartOrderEntryOperationMutationMutation,
      StartOrderEntryOperationMutationMutationVariables
    >(StartOrderEntryOperationMutation, {
      data: { objectKey: '', orderFormId: '', sessionToken: null },
    })

  const { data: statusData, error: statusError } = useQuery<
    OrderEntryOperationQueryQuery,
    OrderEntryOperationQueryQueryVariables
  >(
    OrderEntryOperationQuery,
    { operationId: operationId ?? '' },
    {
      doNotRun: !operationId,
      refreshInterval: (latestData) => {
        const s = latestData?.orderEntryOperation?.status
        if (s && TERMINAL_STATUSES.has(s)) return 0
        return 2000
      },
    }
  )

  const startOperation = useCallback(
    async (data: {
      objectKey: string
      orderFormId: string
      sessionToken?: string
    }) => {
      const result = await startOp({
        data: {
          ...data,
          sessionToken: data.sessionToken ?? null,
        },
      })
      const id = result?.startOrderEntryOperation?.operationId
      if (id) setOperationId(id)
    },
    [startOp]
  )

  const reset = useCallback(() => setOperationId(null), [])

  const currentStatus = statusData?.orderEntryOperation?.status ?? null
  const isPolling =
    !!operationId && !!currentStatus && !TERMINAL_STATUSES.has(currentStatus)
  const isPending = !!operationId && !currentStatus

  return {
    startOperation,
    status: statusData?.orderEntryOperation ?? null,
    isLoading: isStarting || isPolling || isPending,
    error: (startError ?? statusError ?? null) as Error | null,
    reset,
  }
}
