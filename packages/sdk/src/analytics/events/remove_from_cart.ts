import type { CurrencyCode, Item } from './common'

export interface RemoveFromCartParams {
  currency?: CurrencyCode
  value?: number
  items?: Item[]
}

export interface RemoveFromCartEvent {
  name: 'remove_from_cart'
  params: RemoveFromCartParams
}
