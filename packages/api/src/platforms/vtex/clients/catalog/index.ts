import { fetchAPI } from '../fetch'

export interface LocalizedCategoryEntry {
  id: number
  name: string
  /** Slash-separated IDs from root to this node, e.g. "9281/9285". Used to determine depth. */
  fullPath: string
  /** Slash-separated localized slugs from root to this node, e.g. "apparel/t-shirts". */
  fullPathUriName: string
}

export interface LocalizedProductEntry {
  linkId: string
  /** All categories the product belongs to across all trees, as returned by Catalog Dataplane. */
  categories: LocalizedCategoryEntry[]
}

export interface LocalizedProductResponse {
  id: number
  linkId: string
  name: string
  /** Leaf category (deepest level) the product is registered under. */
  category: LocalizedCategoryEntry | null
  /** Full ancestry chain for every category tree the product belongs to. */
  categories: LocalizedCategoryEntry[]
}

/**
 * Client for the VTEX Catalog Dataplane API.
 * Uses Accept-Language header to return locale-specific product data.
 */
export const CatalogDataplane = ({
  account,
  environment,
}: Pick<Options, 'account' | 'environment'>) => {
  const base = `https://api.${environment}.com.br`

  return {
    getLocalizedProduct: (
      productId: string,
      locale: string
    ): Promise<LocalizedProductResponse> =>
      fetchAPI(
        `${base}/api/catalog-dataplane/product/${productId}?an=${account}`,
        {
          method: 'GET',
          headers: {
            'Accept-Language': locale,
            'Content-Type': 'application/json',
          },
        }
      ),
  }
}
