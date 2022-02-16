import type { CurrencyCode, Item } from './common'

export interface PurchaseParams<T extends Item = Item> {
  currency?: CurrencyCode
  transaction_id?: string
  value?: number
  affiliation?: string
  coupon?: string
  shipping?: number
  tax?: number
  items?: T[]
}

export interface PurchaseEvent<T extends Item = Item> {
  name: 'purchase'
  params: PurchaseParams<T>
}
