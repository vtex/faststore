import type { CurrencyCode, Item } from './common'

export interface AddToCartData {
  currency?: CurrencyCode
  value?: number
  items?: Item[]
}

export interface AddToCartEvent {
  name: 'add_to_cart'
  params: AddToCartData
}
