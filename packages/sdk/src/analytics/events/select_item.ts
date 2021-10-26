import type { Item } from './common'

export interface SelectItemData {
  item_list_id?: string
  item_list_name?: string
  items?: Item[]
}

export interface SelectItemEvent {
  type: 'select_item'
  data: SelectItemData
}
