import type { PromotionItem, PromotionProperties } from './common'

export interface ViewPromotionItems {
  items?: PromotionItem[]
}

export type ViewPromotionData = PromotionProperties & ViewPromotionItems

export interface ViewPromotionEvent {
  name: 'view_promotion'
  params: ViewPromotionData
}
