import { useCallback, useEffect, useRef, useState } from 'react'

import { fcBffRequest } from './client'
import { CART_QUERY } from './queries'
import type { CartUnion } from './types'

interface CartQueryResponse {
  cart: CartUnion
}

interface UseCartFCReturn {
  data: CartUnion | null
  isLoading: boolean
  error: Error | null
  mutate: () => void
  setOptimisticData: (updater: (prev: CartUnion | null) => CartUnion | null) => void
}

export function useCartFC(): UseCartFCReturn {
  const [data, setData] = useState<CartUnion | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const mountedRef = useRef(true)

  const fetchCart = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fcBffRequest<CartQueryResponse>(CART_QUERY)

      if (mountedRef.current) {
        setData(response.cart)
      }
    } catch (err) {
      if (mountedRef.current) {
        setError(err instanceof Error ? err : new Error('Failed to fetch cart'))
      }
    } finally {
      if (mountedRef.current) {
        setIsLoading(false)
      }
    }
  }, [])

  useEffect(() => {
    mountedRef.current = true
    fetchCart()

    return () => {
      mountedRef.current = false
    }
  }, [fetchCart])

  const setOptimisticData = useCallback(
    (updater: (prev: CartUnion | null) => CartUnion | null) => {
      setData(updater)
    },
    []
  )

  return { data, isLoading, error, mutate: fetchCart, setOptimisticData }
}
