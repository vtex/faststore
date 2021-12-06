import type { CurrencyCode, Item } from './common'

export interface BeginCheckoutParams {
  currency?: CurrencyCode
  value?: number
  coupon?: string
  items?: Item[]
}

export interface BeginCheckoutEvent {
  name: 'begin_checkout'
  params: BeginCheckoutParams
}
