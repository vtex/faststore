import DataLoader from 'dataloader'
import pLimit from 'p-limit'

import { NotFoundError } from '../../errors'
import type { Clients } from '../clients'
import type {
  ByLinkIdBrandResponse,
  ByLinkIdCategoryResponse,
  ByLinkIdCollectionResponse,
} from '../clients/commerce/types/ByLinkId'

const CONCURRENT_REQUESTS_MAX = 20

/**
 * Load key for the collection DataLoader. `locale` is captured at the call
 * site (not re-read from mutable `ctx.storage`) so concurrent aliased
 * `collection` fields with different locales cannot share a cache entry or
 * race on Accept-Language.
 */
export type CollectionLoadKey = {
  slug: string
  /** Catalog Accept-Language; `undefined` when localization is disabled. */
  locale?: string
}

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

export const getCollectionLoader = (_: Options, clients: Clients) => {
  const limit = pLimit(CONCURRENT_REQUESTS_MAX)

  const loader = async (keys: readonly CollectionLoadKey[]): Promise<Root[]> =>
    Promise.all(
      keys.map((key) =>
        limit(async () => {
          // Normalize to lowercase for DataLoader cache-key consistency
          // (e.g. "Sporting" and "sporting" are the same). The by-linkid API is
          // case-insensitive by design (it preserves the legacy pagetype behavior).
          // Accents are significant and are preserved by toLowerCase() (e.g. "vestuário").
          const normalizedSlug = key.slug.toLowerCase()
          // Use the locale captured on the load key — do not re-read
          // ctx.storage.locale here (it can change mid-request).
          const locale = key.locale

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
            `No catalog entity found for slug: ${key.slug}. Cascade exhausted (category → brand → collection).`
          )
        })
      )
    )

  return new DataLoader<CollectionLoadKey, Root, string>(loader, {
    // DataLoader is used for caching, not batching
    batch: false,
    // Dedup by lowercased slug + captured locale so casing variants share an
    // entry while same-slug / different-locale loads stay isolated.
    cacheKeyFn: ({ slug, locale }) => `${slug.toLowerCase()}::${locale ?? ''}`,
  })
}
