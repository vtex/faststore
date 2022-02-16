import type { Item } from './common'

export interface ViewItemListParams<T extends Item = Item> {
  item_list_id?: string
  item_list_name?: string
  items?: T[]
}

export interface ViewItemListEvent<T extends Item = Item> {
  name: 'view_item_list'
  params: ViewItemListParams<T>
}
