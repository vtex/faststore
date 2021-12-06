import type { CurrencyCode, Item } from './common'

export interface AddPaymentInfoParams {
  currency?: CurrencyCode
  value?: number
  coupon?: string
  payment_type?: string
  items?: Item[]
}

export interface AddPaymentInfoEvent {
  name: 'add_payment_info'
  params: AddPaymentInfoParams
}
