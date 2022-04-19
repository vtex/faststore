import type { CurrencyCode, Item } from './common'

export interface RemoveFromCartParams<T extends Item = Item> {
  currency?: CurrencyCode
  value?: number
  items?: T[]
}

export interface RemoveFromCartEvent<T extends Item = Item> {
  name: 'remove_from_cart'
  params: RemoveFromCartParams<T>
}
