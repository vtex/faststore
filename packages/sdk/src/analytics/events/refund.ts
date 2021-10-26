import type { CurrencyCode, Item } from './common'

export interface RefundData {
  currency?: CurrencyCode
  transaction_id?: string
  value?: number
  affiliation?: string
  coupon?: string
  shipping?: number
  tax?: number
  items?: Item[]
}

export interface RefundEvent {
  type: 'refund'
  data: RefundData
}
