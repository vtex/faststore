import DataLoader from 'dataloader'
import pLimit from 'p-limit'

import type { GraphqlContext } from '..'
import { NotFoundError } from '../../errors'
import type { Clients } from '../clients'
import type {
  ByLinkIdBrandResponse,
  ByLinkIdCategoryResponse,
  ByLinkIdCollectionResponse,
} from '../clients/commerce/types/ByLinkId'
import { getCatalogLocale } from '../utils/localization'

const CONCURRENT_REQUESTS_MAX = 20

export type ByLinkIdCategoryRoot = ByLinkIdCategoryResponse & {
  entityType: 'category'
  /**
   * Full accumulated input slug injected by the loader (e.g. "vestuario/camisetas").
   * Used by slugifyRoot so that meta.selectedFacets builds the correct facet keys
   * without relying on root.url (which is absent in the by-linkid response).
   */
  slug: string
}

export type ByLinkIdBrandRoot = ByLinkIdBrandResponse & {
  entityType: 'brand'
}

export type ByLinkIdCollectionRoot = ByLinkIdCollectionResponse & {
  entityType: 'collection'
}

export type Root =
  | ByLinkIdCategoryRoot
  | ByLinkIdBrandRoot
  | ByLinkIdCollectionRoot

export const isCategory = (root: Root): root is ByLinkIdCategoryRoot =>
  root.entityType === 'category'

export const isBrand = (root: Root): root is ByLinkIdBrandRoot =>
  root.entityType === 'brand'

export const isCollection = (root: Root): root is ByLinkIdCollectionRoot =>
  root.entityType === 'collection'

export const getCollectionLoader = (
  _: Options,
  clients: Clients,
  ctx: GraphqlContext
) => {
  const limit = pLimit(CONCURRENT_REQUESTS_MAX)

  const loader = async (slugs: readonly string[]): Promise<Root[]> => {
    // Resolve the locale to forward to the by-linkid endpoints at
    // request time. `undefined` when localization is disabled so non-localized
    // stores keep sending no Accept-Language header.
    const locale = getCatalogLocale(ctx)

    return Promise.all(
      slugs.map((slug: string) =>
        limit(async () => {
          // Normalize to lowercase for DataLoader cache-key consistency
          // (e.g. "Sporting" and "sporting" are the same). The by-linkid API is
          // case-insensitive by design (it preserves the legacy pagetype behavior).
          // Accents are significant and are preserved by toLowerCase() (e.g. "vestuário").
          const normalizedSlug = slug.toLowerCase()

          // Step 1: category
          // Pass the full path so the API validates each segment and returns only
          // the unambiguous leaf category. E.g. "vestuario/camisetas" resolves to
          // the "camisetas" that is a child of "vestuario", not any other category
          // that happens to share the linkId "camisetas".
          // The full slug is also injected into the result for meta.selectedFacets
          // and breadcrumb URL construction.
          const category = await clients.commerce.catalog.byLinkId.category(
            normalizedSlug,
            locale
          )
          if (category) {
            return {
              ...category,
              entityType: 'category' as const,
              slug: normalizedSlug,
            }
          }

          // Step 2: brand (always single-segment)
          const brand = await clients.commerce.catalog.byLinkId.brand(
            normalizedSlug,
            locale
          )
          if (brand) {
            return { ...brand, entityType: 'brand' as const }
          }

          // Step 3: collection cluster (always single-segment)
          const collection = await clients.commerce.catalog.byLinkId.collection(
            normalizedSlug,
            locale
          )
          if (collection) {
            return { ...collection, entityType: 'collection' as const }
          }

          throw new NotFoundError(
            `No catalog entity found for slug: ${slug}. Cascade exhausted (category → brand → collection).`
          )
        })
      )
    )
  }

  return new DataLoader<string, Root>(loader, {
    // DataLoader is used for caching, not batching
    batch: false,
    // Normalize casing at the cache-key level so load("Sporting") and
    // load("sporting") share one entry — the loader itself already
    // lowercases before calling the API, this just dedupes the cache.
    cacheKeyFn: (slug) => slug.toLowerCase(),
  })
}
