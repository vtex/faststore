import type { CurrencyCode, Item } from './common'

export interface ViewCartData {
  currency?: CurrencyCode
  value?: number
  items?: Item[]
}

export interface ViewCartEvent {
  type: 'view_cart'
  data: ViewCartData
}
