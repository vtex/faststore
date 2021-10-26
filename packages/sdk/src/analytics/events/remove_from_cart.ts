import type { CurrencyCode, Item } from './common'

export interface RemoveFromCartData {
  currency?: CurrencyCode
  value?: number
  items?: Item[]
}

export interface RemoveFromCartEvent {
  type: 'remove_from_cart'
  data: RemoveFromCartData
}
