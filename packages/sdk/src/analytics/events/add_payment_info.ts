import type { CurrencyCode, Item } from './common'

export interface AddPaymentInfoData {
  currency?: CurrencyCode
  value?: number
  coupon?: string
  payment_type?: string
  items?: Item[]
}

export interface AddPaymentInfoEvent {
  type: 'add_payment_info'
  data: AddPaymentInfoData
}
