import type { Item } from './common'

export interface ViewItemListData {
  item_list_id?: string
  item_list_name?: string
  items?: Item[]
}

export interface ViewItemListEvent {
  type: 'view_item_list'
  data: ViewItemListData
}
