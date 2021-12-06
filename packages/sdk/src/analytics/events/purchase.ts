import type { CurrencyCode, Item } from './common'

export interface PurchaseParams {
  currency?: CurrencyCode
  transaction_id?: string
  value?: number
  affiliation?: string
  coupon?: string
  shipping?: number
  tax?: number
  items?: Item[]
}

export interface PurchaseEvent {
  name: 'purchase'
  params: PurchaseParams
}
