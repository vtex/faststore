import { NotFoundError } from '../../errors'
import type { ProductCluster } from '../clients/search/types/ProductSearchResult'
import type { GraphqlContext } from '../index'
import type { EnhancedSku } from './enhanceSku'
import {
  getSegmentExtraFacets,
  parseSegmentCookie,
} from './intelligentSearchRequest'

const PRODUCT_CLUSTER_IDS_KEY = 'productClusterIds'
const EXCLUDED_PREFIX = 'not:'

export interface ProductClusterRestriction {
  allowed: Set<string>
  excluded: Set<string>
}

/**
 * Collections the shopper's assortment is restricted to, as carried by the
 * `vtex_segment` cookie (`productClusterIds=X` allows, `productClusterIds=not:Y`
 * excludes). Returns `null` when the segment carries no restriction.
 */
export function getProductClusterRestriction(
  segment: Record<string, unknown>
): ProductClusterRestriction | null {
  const allowed = new Set<string>()
  const excluded = new Set<string>()

  for (const { key, value } of getSegmentExtraFacets(segment)) {
    if (key !== PRODUCT_CLUSTER_IDS_KEY) continue

    for (const rawId of value.split(',')) {
      const id = rawId.trim()

      if (id.startsWith(EXCLUDED_PREFIX)) {
        const excludedId = id.slice(EXCLUDED_PREFIX.length)
        if (excludedId) excluded.add(excludedId)
      } else if (id) {
        allowed.add(id)
      }
    }
  }

  if (allowed.size === 0 && excluded.size === 0) {
    return null
  }

  return { allowed, excluded }
}

export function isProductInAssortment(
  productClusters: ProductCluster[] | undefined,
  { allowed, excluded }: ProductClusterRestriction
): boolean {
  const clusterIds = (productClusters ?? []).map(({ id }) => String(id))

  if (clusterIds.some((id) => excluded.has(id))) {
    return false
  }

  return allowed.size === 0 || clusterIds.some((id) => allowed.has(id))
}

/**
 * Listing endpoints get the assortment applied by Intelligent Search through
 * the segment facets, but the `products` endpoint used to fetch a single
 * product does not, so a product outside the shopper's assortment must be
 * rejected here.
 */
export function assertProductInContractAssortment(
  ctx: GraphqlContext,
  sku: EnhancedSku
): void {
  const restriction = getProductClusterRestriction(
    parseSegmentCookie(ctx.headers?.cookie)
  )

  if (!restriction) {
    return
  }

  if (!isProductInAssortment(sku.isVariantOf.productClusters, restriction)) {
    throw new NotFoundError(
      `Product ${sku.isVariantOf.productId} is not in the shopper's assortment`
    )
  }
}
