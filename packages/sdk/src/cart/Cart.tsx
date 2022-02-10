import React, { createContext, useMemo } from 'react'
import type { FC } from 'react'

import { useStorage } from '../storage/useStorage'
import { SDKError } from '../utils/error'

export interface Item {
  id: string
  quantity: number
}

export interface Cart {
  id: string
  items: Record<Item['id'], Item>
}

export interface ContextValue<T extends Item = Item>
  extends Omit<Cart, 'items'> {
  items: T[]
  isEmpty: boolean
  addItem: (item: T) => void
  removeItem: (id: Item['id']) => void
  updateItemQuantity: (id: Item['id'], quantity: number) => void
  emptyCart: () => void
  getItem: (id: Item['id']) => T | undefined
  inCart: (id: Item['id']) => boolean
  setCart: (cart: Omit<Cart, 'items'> & { items: T[] }) => void
}

export const Context = createContext<ContextValue | undefined>(undefined)
Context.displayName = 'StoreCartContext'

const initialState: Cart = {
  id: '',
  items: {},
}

const setItemToCartState = (cart: Cart, id: Item['id'], item: Item) => ({
  ...cart,
  items: { ...cart.items, [id]: item },
})

const removeItemFromCartState = (cart: Cart, id: Item['id']) => {
  const { [id]: removed, ...items } = cart.items

  return {
    ...cart,
    items,
  }
}

export interface Props {
  namespace?: string
  initialCart?: Cart
  onItemAdd?: (newItem: Item, oldItem?: Item) => void
  onItemUpdate?: (newItem: Item, oldItem?: Item) => void
  onItemRemove?: (item?: Item) => void
}

export const CartProvider: FC<Props> = ({
  children,
  onItemAdd,
  initialCart,
  onItemRemove,
  onItemUpdate,
  namespace: nspc = 'main',
}) => {
  const namespace = `${nspc}::store::cart`
  const [cart, setCart] = useStorage(namespace, () => ({
    ...initialState,
    ...initialCart,
  }))

  const value = useMemo((): ContextValue => {
    const items = Object.values(cart.items)

    const set: ContextValue['setCart'] = (c) => {
      const newCart = {
        ...c,
        items: c.items.reduce((acc, curr) => {
          acc[curr.id] = curr

          return acc
        }, {} as Record<string, Item>),
      }

      setCart(newCart)
    }

    const addItem = (item: Item) => {
      if (!item.id) {
        throw new SDKError('You must provide an `id` for items')
      }

      if (item.quantity < 0) {
        throw new SDKError('Item quantity needs to be higher than zero')
      }

      const currentItem = cart.items[item.id]

      const newItem = currentItem
        ? {
            ...item,
            quantity: currentItem.quantity + item.quantity,
          }
        : item

      const callback = currentItem ? onItemUpdate : onItemAdd

      setCart(setItemToCartState(cart, newItem.id, newItem))
      callback?.(newItem, currentItem)
    }

    const updateItemQuantity = (id: Item['id'], quantity: number) => {
      const currentItem = cart.items[id]

      if (!currentItem) {
        throw new SDKError(`Item with id not found: ${id}`)
      }

      const newItem = {
        ...currentItem,
        quantity,
      }

      setCart(setItemToCartState(cart, id, newItem))
      onItemUpdate?.(newItem, currentItem)
    }

    const removeItem = (id: Item['id']) => {
      const item = cart.items[id]

      setCart(removeItemFromCartState(cart, id))
      onItemRemove?.(item)
    }

    const emptyCart = () => setCart({ ...cart, items: {} })

    const getItem = (id: Item['id']) => cart.items[id]

    const inCart = (id: Item['id']) => Boolean(cart.items[id])

    return {
      ...cart,
      setCart: set,
      addItem,
      updateItemQuantity,
      removeItem,
      emptyCart,
      getItem,
      inCart,
      items,
      isEmpty: items.length === 0,
    }
  }, [cart, onItemAdd, onItemRemove, onItemUpdate, setCart])

  return <Context.Provider value={value}>{children}</Context.Provider>
}
