import type { CurrencyCode, Item } from './common'

export interface AddShippingInfoParams {
  currency?: CurrencyCode
  value?: number
  coupon?: string
  shipping_tier?: string
  items?: Item[]
}

export interface AddShippingInfoEvent {
  name: 'add_shipping_info'
  params: AddShippingInfoParams
}
