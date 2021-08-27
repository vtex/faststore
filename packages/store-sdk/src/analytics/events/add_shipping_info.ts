import type { CurrencyCode, Item } from './common'

export interface AddShippingInfoData {
  currency?: CurrencyCode
  value?: number
  coupon?: string
  shipping_tier?: string
  items?: Item[]
}

export interface AddShippingInfoEvent {
  type: 'add_shipping_info'
  data: AddShippingInfoData
}
