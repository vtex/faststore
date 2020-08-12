import { SearchFilterValue } from '@vtex/store-ui'

export interface TreeValue extends SearchFilterValue {
  pathname: string
  values: TreeValue[]
}
