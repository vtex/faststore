import type { CurrencyCode, Item } from './common'

export interface ViewItemParams<T extends Item = Item> {
  currency?: CurrencyCode
  value?: number
  items?: T[]
}

export interface ViewItemEvent<T extends Item = Item> {
  name: 'view_item'
  params: ViewItemParams<T>
}
