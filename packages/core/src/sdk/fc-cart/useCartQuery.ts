import { useCallback, useEffect, useRef, useState } from 'react'

import { fcGraphQL } from './client'
import { CART_QUERY } from './queries'
import type { FCCartUnion, FCSummary } from './types'

interface CartQueryData {
  cart: FCCartUnion
}

export interface FCCartState {
  cart: FCCartUnion | null
  summary: FCSummary | null
  isLoading: boolean
  error: string | null
}

export interface UseCartQueryReturn extends FCCartState {
  refetch: () => Promise<void>
  setCart: (cart: FCCartUnion | null) => void
  setSummary: (summary: FCSummary | null) => void
}

export function useCartQuery(): UseCartQueryReturn {
  const [state, setState] = useState<FCCartState>({
    cart: null,
    summary: null,
    isLoading: true,
    error: null,
  })

  const mountedRef = useRef(true)

  useEffect(() => {
    return () => {
      mountedRef.current = false
    }
  }, [])

  const fetchCart = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }))

    try {
      const data = await fcGraphQL<CartQueryData>(CART_QUERY)

      if (mountedRef.current) {
        setState((prev) => ({
          ...prev,
          cart: data.cart,
          isLoading: false,
        }))
      }
    } catch (err) {
      if (mountedRef.current) {
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: err instanceof Error ? err.message : 'Failed to load cart',
        }))
      }
    }
  }, [])

  useEffect(() => {
    fetchCart()
  }, [fetchCart])

  const setCart = useCallback((cart: FCCartUnion | null) => {
    setState((prev) => ({ ...prev, cart }))
  }, [])

  const setSummary = useCallback((summary: FCSummary | null) => {
    setState((prev) => ({ ...prev, summary }))
  }, [])

  return {
    ...state,
    refetch: fetchCart,
    setCart,
    setSummary,
  }
}
