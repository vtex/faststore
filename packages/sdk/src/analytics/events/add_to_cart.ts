import type { CurrencyCode, Item } from './common'

export interface AddToCartData {
  currency?: CurrencyCode
  value?: number
  items?: Item[]
}

export interface AddToCartEvent {
  type: 'add_to_cart'
  data: AddToCartData
}
