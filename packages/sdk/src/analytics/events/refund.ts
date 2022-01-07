import type { CurrencyCode, Item } from './common'

export interface RefundParams<T extends Item = Item> {
  currency?: CurrencyCode
  transaction_id?: string
  value?: number
  affiliation?: string
  coupon?: string
  shipping?: number
  tax?: number
  items?: T[]
}

export interface RefundEvent<T extends Item = Item> {
  name: 'refund'
  params: RefundParams<T>
}
