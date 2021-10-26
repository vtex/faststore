import React, { useMemo } from 'react'

import { useContext } from '../utils/useContext'
import { Context as CartContext } from './Cart'
import { Context as OptimisticContext } from './Optimistic'
import type { Item, ContextValue as CartContextValue } from './Cart'

export const useCart = <T extends Item = Item>() => {
  const cart = useContext<CartContextValue<T>>(CartContext as any)
  const optimistic = React.useContext(OptimisticContext)

  return useMemo(() => ({ ...cart, isValidating: Boolean(optimistic) }), [
    cart,
    optimistic,
  ])
}
