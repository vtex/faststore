import type { PromotionItem, PromotionProperties } from './common'

export interface SelectPromotionItems {
  items?: PromotionItem[]
}

export type SelectPromotionData = PromotionProperties & SelectPromotionItems

export interface SelectPromotionEvent {
  name: 'select_promotion'
  params: SelectPromotionData
}
