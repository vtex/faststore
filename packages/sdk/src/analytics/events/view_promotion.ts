import type { PromotionItem, PromotionParams } from './common'

export interface ViewPromotionItems<T extends PromotionItem = PromotionItem> {
  items?: T[]
}

export type ViewPromotionParams<T extends PromotionItem = PromotionItem> =
  PromotionParams & ViewPromotionItems<T>

export interface ViewPromotionEvent<T extends PromotionItem = PromotionItem> {
  name: 'view_promotion'
  params: ViewPromotionParams<T>
}
