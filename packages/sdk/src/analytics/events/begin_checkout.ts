import type { CurrencyCode, Item } from './common'

export interface BeginCheckoutData {
  currency?: CurrencyCode
  value?: number
  coupon?: string
  items?: Item[]
}

export interface BeginCheckoutEvent {
  type: 'begin_checkout'
  data: BeginCheckoutData
}
