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

  const loader = async (slugs: readonly string[]): Promise<Root[]> => {
    return Promise.all(
      slugs.map((slug: string) =>
        limit(async () => {
          // Normalize to lowercase so that merchants who register linkIds with mixed
          // casing (allowed by the Catalog multilanguage API) get the same resolution
          // as lowercase URLs. The by-linkid API is case-sensitive, while the legacy
          // pagetype API was not, so skipping this would be a regression.
          const normalizedSlug = slug.toLowerCase()

          // For multi-segment slugs (e.g. "vestuario/camisetas") the entity type is
          // determined by the last segment — the leaf category owns the page.
          // The full slug is injected into the result for meta.selectedFacets and
          // breadcrumb URL construction.
          const lastSegment = normalizedSlug.split('/').at(-1)!

          // Step 1: category
          const categories =
            await clients.commerce.catalog.byLinkId.category(lastSegment)
          if (categories !== null && categories.length > 0) {
            // When multiple categories share the same linkId at different tree levels
            // (e.g. "bolas" under both "esportes" and "infantil"), fatherCategoryId-based
            // disambiguation can be added here in a follow-up. For now, take the first match.
            return {
              ...categories[0],
              entityType: 'category' as const,
              slug: normalizedSlug,
            }
          }

          // Step 2: brand (always single-segment)
          const brands =
            await clients.commerce.catalog.byLinkId.brand(normalizedSlug)
          if (brands !== null && brands.length > 0) {
            return { ...brands[0], entityType: 'brand' as const }
          }

          // Step 3: collection cluster (always single-segment)
          const collections =
            await clients.commerce.catalog.byLinkId.collection(normalizedSlug)
          if (collections !== null && collections.length > 0) {
            return { ...collections[0], entityType: 'collection' as const }
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
  })
}
