import type { CurrencyCode, Item } from './common'

export interface AddShippingInfoParams<T extends Item = Item> {
  currency?: CurrencyCode
  value?: number
  coupon?: string
  shipping_tier?: string
  items?: T[]
}

export interface AddShippingInfoEvent<T extends Item = Item> {
  name: 'add_shipping_info'
  params: AddShippingInfoParams<T>
}
