import type { CurrencyCode, Item } from './common'

export interface PurchaseData {
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
  type: 'purchase'
  data: PurchaseData
}
