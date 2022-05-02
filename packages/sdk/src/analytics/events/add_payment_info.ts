import type { CurrencyCode, Item } from './common'

export interface AddPaymentInfoParams<T extends Item = Item> {
  currency?: CurrencyCode
  value?: number
  coupon?: string
  payment_type?: string
  items?: T[]
}

export interface AddPaymentInfoEvent<T extends Item = Item> {
  name: 'add_payment_info'
  params: AddPaymentInfoParams<T>
}
