import { Value } from '@vtex/store-ui'

export interface TreeValue extends Value {
  pathname: string
  values: TreeValue[]
}
