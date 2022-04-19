import type { CurrencyCode, Item } from './common'

export interface ViewCartParams<T extends Item = Item> {
  currency?: CurrencyCode
  value?: number
  items?: T[]
}

export interface ViewCartEvent<T extends Item = Item> {
  name: 'view_cart'
  params: ViewCartParams<T>
}
