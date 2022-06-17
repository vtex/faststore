import type { PromotionItem, PromotionParams } from './common'

export interface SelectPromotionItems<T extends PromotionItem = PromotionItem> {
  items?: T[]
}

export type SelectPromotionParams<T extends PromotionItem = PromotionItem> =
  PromotionParams & SelectPromotionItems<T>

export interface SelectPromotionEvent<T extends PromotionItem = PromotionItem> {
  name: 'select_promotion'
  params: SelectPromotionParams<T>
}
