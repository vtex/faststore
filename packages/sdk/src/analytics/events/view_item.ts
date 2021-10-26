import type { CurrencyCode, Item } from './common'

export interface ViewItemData {
  currency?: CurrencyCode
  value?: number
  items?: Item[]
}

export interface ViewItemEvent {
  type: 'view_item'
  data: ViewItemData
}
