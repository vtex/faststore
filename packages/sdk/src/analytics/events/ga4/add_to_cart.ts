import type { CurrencyCode, Item } from './common'

export interface AddToCartParams<T extends Item = Item> {
  currency?: CurrencyCode
  value?: number
  items?: T[]
}

export interface AddToCartEvent<T extends Item = Item> {
  name: 'add_to_cart'
  params: AddToCartParams<T>
}
