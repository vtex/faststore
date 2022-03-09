import type { Item } from './common'

export interface SelectItemParams<T extends Item = Item> {
  item_list_id?: string
  item_list_name?: string
  items?: T[]
}

export interface SelectItemEvent<T extends Item = Item> {
  name: 'select_item'
  params: SelectItemParams<T>
}
