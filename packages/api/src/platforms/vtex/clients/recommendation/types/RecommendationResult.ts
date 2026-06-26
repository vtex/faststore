import type { Product } from '../../search/types/ProductSearchResult'

/**
 * Raw response of the VTEX Recommendations BFF
 * (`GET /api/recommend-bff/v2/recommendations`).
 *
 * The BFF already returns the products fully hydrated in the same Intelligent
 * Search shape (`Product`) used by the `search` query, so the resolver can map
 * them straight to the normalized `StoreProduct` shape via `pickBestSku` +
 * `enhanceSku` — no extra round-trip to search is needed.
 */
export interface RecommendationResult {
  products: Product[]
  correlationId: string
  campaign: RecommendationBffCampaign
}

export interface RecommendationBffCampaign {
  id: string
  title?: string
  type: string
}

/** Response of `POST /api/recommend-bff/v2/users/start-session`. */
export interface StartRecommendationSessionResult {
  recommendationsUserId: string
}
