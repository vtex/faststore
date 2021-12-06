import type { Item } from './common'

export interface ViewItemListParams {
  item_list_id?: string
  item_list_name?: string
  items?: Item[]
}

export interface ViewItemListEvent {
  name: 'view_item_list'
  params: ViewItemListParams
}
