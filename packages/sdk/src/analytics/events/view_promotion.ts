import type { PromotionItem, PromotionParams } from './common'

export interface ViewPromotionItems {
  items?: PromotionItem[]
}

export type ViewPromotionParams = PromotionParams & ViewPromotionItems

export interface ViewPromotionEvent {
  name: 'view_promotion'
  params: ViewPromotionParams
}
