import type { CurrencyCode, Item } from './common'

export interface AddToWishlistData {
  currency?: CurrencyCode
  value?: number
  items?: Item[]
}

export interface AddToWishlistEvent {
  type: 'add_to_wishlist'
  data: AddToWishlistData
}
