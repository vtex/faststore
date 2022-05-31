import React, { createContext, useMemo } from 'react'
import type { PropsWithChildren } from 'react'

import { useContext } from '../utils/useContext'
import { createUseValidationHook } from '../utils/useValidation'
import { Context as CartContext } from './Cart'
import type { ContextValue as CartContextValue, Item } from './Cart'

export type Cart<T extends Item> = Pick<CartContextValue<T>, 'id' | 'items'>

export interface Props<T extends Item> {
  onValidateCart?: (cart: Cart<T>) => Promise<Cart<T> | null>
}

export const Context = createContext<boolean | undefined>(undefined)
Context.displayName = 'StoreCartValidatorContext'

const useValidation = createUseValidationHook()

export const OptimisticProvider = <T extends Item = Item>({
  children,
  onValidateCart,
}: PropsWithChildren<Props<T>>) => {
  const { items, id, setCart } = useContext(CartContext)
  const cart = useMemo(() => ({ id, items }), [id, items])

  const isValidating = useValidation({
    onValidate: onValidateCart,
    value: cart as Cart<T>,
    setValue: setCart,
  })

  return <Context.Provider value={isValidating}>{children}</Context.Provider>
}
