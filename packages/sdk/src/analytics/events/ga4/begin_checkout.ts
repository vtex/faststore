import type { CurrencyCode, Item } from './common'

export interface BeginCheckoutParams<T extends Item = Item> {
  currency?: CurrencyCode
  value?: number
  coupon?: string
  items?: T[]
}

export interface BeginCheckoutEvent<T extends Item = Item> {
  name: 'begin_checkout'
  params: BeginCheckoutParams<T>
}
