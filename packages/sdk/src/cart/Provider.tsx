import React from 'react'
import type { PropsWithChildren } from 'react'

import { CartProvider } from './Cart'
import { OptimisticProvider } from './Optimistic'
import type { Props as CartProps, Item } from './Cart'
import type { Props as OptimisticProps } from './Optimistic'

interface Props<T extends Item> extends CartProps, OptimisticProps<T> {
  /**
   * optimistic for validating the cart with the backend.
   * Pure for not making any requests to the backend
   * */
  mode?: 'optimistic' | 'pure'
}

export const Provider = <T extends Item = Item>({
  mode = 'pure',
  onValidateCart,
  children,
  ...cartProps
}: PropsWithChildren<Props<T>>) => (
  <CartProvider {...cartProps}>
    {mode === 'optimistic' ? (
      <OptimisticProvider onValidateCart={onValidateCart}>
        {children}
      </OptimisticProvider>
    ) : (
      children
    )}
  </CartProvider>
)
