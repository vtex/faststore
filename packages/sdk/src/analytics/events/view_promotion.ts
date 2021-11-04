import type { PromotionItem, PromotionProperties } from './common'

export interface ViewPromotionItems {
  items?: PromotionItem[]
}

export type ViewPromotionData = PromotionProperties & ViewPromotionItems

export interface ViewPromotionEvent {
  type: 'view_promotion'
  data: ViewPromotionData
}
