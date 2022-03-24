import React, { createContext, useEffect, useMemo, useState } from 'react'
import type { PropsWithChildren } from 'react'

import { useContext } from '../utils/useContext'
import { Context as CartContext } from './Cart'
import type { ContextValue as CartContextValue, Item } from './Cart'

export type Cart<T extends Item> = Pick<CartContextValue<T>, 'id' | 'items'>

export interface Props<T extends Item> {
  onValidateCart?: (cart: Cart<T>) => Promise<Cart<T> | null>
}

export const Context = createContext<boolean | undefined>(undefined)
Context.displayName = 'StoreCartValidatorContext'

const nullable = async () => null

// Validation queue
let queue = Promise.resolve()

export const OptimisticProvider = <T extends Item = Item>({
  children,
  onValidateCart = nullable,
}: PropsWithChildren<Props<T>>) => {
  const { items, id, setCart } = useContext(CartContext)
  const cart = useMemo(() => ({ id, items }), [id, items])
  const [isValidating, setIsValidating] = useState(false)

  useEffect(() => {
    let cancel = false

    const revalidate = async () => {
      if (cancel) {
        return
      }

      setIsValidating(true)
      const newCart = await onValidateCart(cart as Cart<T>)

      if (cancel) {
        return
      }

      setIsValidating(false)
      if (newCart != null) {
        setTimeout(() => {
          setCart(newCart)
        }, 0)
      }
    }

    // Enqueue validation
    setTimeout(() => {
      queue = queue.then(revalidate)
    }, 0)

    return () => {
      cancel = true
    }
  }, [cart, onValidateCart, setCart])

  return <Context.Provider value={isValidating}>{children}</Context.Provider>
}
