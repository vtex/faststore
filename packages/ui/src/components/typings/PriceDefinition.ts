import type { PriceFormatter } from '../atoms/Price'

export interface PriceDefinition {
  value: number
  listPrice: number
  formatter: PriceFormatter
}
