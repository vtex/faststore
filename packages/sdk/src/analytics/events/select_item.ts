import type { Item } from './common'

export interface SelectItemData {
  item_list_id?: string
  item_list_name?: string
  items?: Item[]
}

export interface SelectItemEvent {
  name: 'select_item'
  params: SelectItemData
}
