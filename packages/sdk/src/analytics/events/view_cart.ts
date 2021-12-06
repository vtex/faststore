import type { CurrencyCode, Item } from './common'

export interface ViewCartParams {
  currency?: CurrencyCode
  value?: number
  items?: Item[]
}

export interface ViewCartEvent {
  name: 'view_cart'
  params: ViewCartParams
}
