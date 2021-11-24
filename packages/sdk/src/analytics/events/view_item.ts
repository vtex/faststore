import type { CurrencyCode, Item } from './common'

export interface ViewItemData {
  currency?: CurrencyCode
  value?: number
  items?: Item[]
}

export interface ViewItemEvent {
  name: 'view_item'
  params: ViewItemData
}
