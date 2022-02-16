import type { CurrencyCode, Item } from './common'

export interface AddToWishlistParams<T extends Item = Item> {
  currency?: CurrencyCode
  value?: number
  items?: T[]
}

export interface AddToWishlistEvent<T extends Item = Item> {
  name: 'add_to_wishlist'
  params: AddToWishlistParams<T>
}
