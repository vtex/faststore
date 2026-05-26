import { fetchAPI } from '../fetch'

export interface LocalizedProductEntry {
  linkId: string
  category: { name: string; fullPathUriName: string } | null
}

export interface LocalizedProductResponse {
  id: number
  linkId: string
  name: string
  category: {
    id: number
    name: string
    fullPath: string
    fullPathUriName: string
  } | null
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
    /**
     * Returns localized product data (linkId, category) for a specific locale.
     * Used for slug validation, otherLocales, and breadcrumb construction.
     */
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
