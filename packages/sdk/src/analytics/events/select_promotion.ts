import type { PromotionItem, PromotionParams } from './common'

export interface SelectPromotionItems {
  items?: PromotionItem[]
}

export type SelectPromotionParams = PromotionParams & SelectPromotionItems

export interface SelectPromotionEvent {
  name: 'select_promotion'
  params: SelectPromotionParams
}
