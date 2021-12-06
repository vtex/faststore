import type { CurrencyCode, Item } from './common'

export interface AddToWishlistParams {
  currency?: CurrencyCode
  value?: number
  items?: Item[]
}

export interface AddToWishlistEvent {
  name: 'add_to_wishlist'
  params: AddToWishlistParams
}
