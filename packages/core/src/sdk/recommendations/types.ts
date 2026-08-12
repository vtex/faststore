/**
 * Source of the products used as context for the recommendation request:
 * - `'PDP'`: the current product detail page product.
 * - `'CART'`: the products currently in the cart (useful for cross-sell on the
 *   cart page and inside the cart drawer).
 */
export type ItemContext = 'PDP' | 'CART'

export type RecommendationType =
  | 'CROSS_SELL'
  | 'SIMILAR_ITEMS'
  | 'PERSONALIZED'
  | 'TOP_ITEMS'
  | 'LAST_SEEN'
  | 'SEARCH_BASED'
  | 'VISUAL_SIMILARITY'
  | 'NEXT_INTERACTION'
