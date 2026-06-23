export type RecommendationShelfProps = {
  title?: string
  campaignVrn: string
}

export type RecommendationType =
  | 'CROSS_SELL'
  | 'SIMILAR_ITEMS'
  | 'PERSONALIZED'
  | 'TOP_ITEMS'
  | 'LAST_SEEN'
  | 'SEARCH_BASED'
  | 'VISUAL_SIMILARITY'
  | 'NEXT_INTERACTION'
