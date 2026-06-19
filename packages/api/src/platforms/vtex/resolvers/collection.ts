import type { GraphqlResolver } from '..'
import {
  isBrand,
  isCategory,
  isCollection,
  type ByLinkIdBrandRoot,
  type ByLinkIdCategoryRoot,
  type ByLinkIdCollectionRoot,
} from '../loaders/collection'
import { slugify } from '../utils/slugify'

export type Root =
  | ByLinkIdCategoryRoot
  | ByLinkIdBrandRoot
  | ByLinkIdCollectionRoot

const slugifyRoot = (root: Root): string => {
  if (isCategory(root)) {
    // root.slug is the full accumulated input slug (e.g. "vestuario/camisetas"),
    // injected by the loader — no URL parsing needed.
    return root.slug
  }

  if (isBrand(root)) {
    return root.linkId
  }

  // collection — linkId may be null for clusters not yet registered in multilanguage
  return root.linkId ?? slugify(root.name)
}

/**
 * Recursively searches the category tree for the item with the given numeric ID
 * and returns the canonical (default-locale) slug extracted from its URL.
 *
 * The Catalog `by-linkid` endpoint echoes back the queried slug in `linkId`
 * when the lookup is performed by a localized (non-canonical) slug. Using the
 * tree URL instead guarantees we always get the default-locale slug that IS
 * expects for `category-N` selectedFacets and for `otherLocales` hreflang.
 */
function findCanonicalSlug(
  tree: Array<{ id: number; url: string; children?: unknown[] }>,
  targetId: number
): string | null {
  for (const item of tree) {
    if (item.id === targetId) {
      try {
        const segments = new URL(item.url).pathname.split('/').filter(Boolean)

        return segments.at(-1) ?? null
      } catch {
        return null
      }
    }

    if (Array.isArray(item.children) && item.children.length > 0) {
      const found = findCanonicalSlug(
        item.children as Array<{
          id: number
          url: string
          children?: unknown[]
        }>,
        targetId
      )

      if (found !== null) return found
    }
  }

  return null
}

export const StoreCollection: Record<string, GraphqlResolver<Root>> = {
  id: ({ id }) => id.toString(),
  slug: (root) => slugifyRoot(root),
  seo: (root) => ({
    title: root.title ?? root.name,
    description: root.metaTagDescription,
  }),
  type: (root) => {
    if (isBrand(root)) return 'Brand'
    if (isCollection(root)) return 'Collection'
    // Department = root category (no parent); Category = everything else.
    // SubCategory distinction (3rd level+) requires recursive parent lookup — deferred.
    return root.fatherCategoryId === null ? 'Department' : 'Category'
  },
  meta: async (root, _, ctx) => {
    const slug = slugifyRoot(root)

    if (isBrand(root)) {
      return { selectedFacets: [{ key: 'brand', value: slug }] }
    }

    if (isCollection(root)) {
      return { selectedFacets: [{ key: 'productclusterids', value: root.id }] }
    }

    // For categories, IS expects canonical (default-locale) slugs in selectedFacets
    // regardless of which locale's slug the URL uses. The by-linkid API echoes the
    // queried slug in entity.linkId when called by a localized slug, so we fetch
    // the category tree and extract the canonical slug from each item's URL instead.
    const segments = slug.split('/').filter(Boolean)
    const segmentSlugs = segments.map((_, i) =>
      segments.slice(0, i + 1).join('/')
    )

    const {
      loaders: { collectionLoader },
      clients: { commerce },
    } = ctx

    const [entities, tree] = await Promise.all([
      Promise.all(segmentSlugs.map((s) => collectionLoader.load(s))),
      commerce.catalog.category.tree(10),
    ])

    return {
      selectedFacets: entities.map((entity, index) => ({
        key: `category-${index + 1}`,
        value: findCanonicalSlug(tree, entity.id) ?? entity.linkId,
      })),
    }
  },
  breadcrumbList: async (root, _, ctx) => {
    const {
      loaders: { collectionLoader },
    } = ctx

    const slug = slugifyRoot(root)

    /**
     * Split slug into segments so each breadcrumb level gets its own
     * by-linkid result. For "vestuario/camisetas" this produces two loader
     * calls: one for "vestuario" and one for "vestuario/camisetas".
     */
    const segments = slug.split('/').filter(Boolean)
    const slugs = segments.map((_, index) =>
      segments.slice(0, index + 1).join('/')
    )

    const collections = await Promise.all(
      slugs.map((s) => collectionLoader.load(s))
    )

    return {
      itemListElement: collections.map((collection, index) => ({
        item: `/${slugifyRoot(collection)}`,
        name: collection.name,
        position: index + 1,
      })),
      numberOfItems: collections.length,
    }
  },

  otherLocales: async (root, _, ctx) => {
    const isLocalizationEnabled =
      (ctx.discoveryConfig as any)?.localization?.enabled === true

    if (!isLocalizationEnabled) return null

    const configuredLocales = Object.keys(
      (ctx.discoveryConfig as any)?.localization?.locales ?? {}
    )

    if (configuredLocales.length === 0) return null

    const currentLocale = ctx.storage.locale
    const slug = slugifyRoot(root)
    const segments = slug.split('/').filter(Boolean)

    if (segments.length === 0) return null

    const {
      loaders: { collectionLoader },
      clients: { commerce },
    } = ctx

    // Build per-level slug paths: ["vestuario", "vestuario/camisetas"].
    // The collectionLoader DataLoader cache means any segment already fetched
    // by breadcrumbList costs nothing here.
    const segmentSlugs = segments.map((_, i) =>
      segments.slice(0, i + 1).join('/')
    )

    let entities: Root[]

    try {
      entities = await Promise.all(
        segmentSlugs.map((s) => collectionLoader.load(s))
      )
    } catch {
      return null
    }

    const defaultLocale = (ctx.discoveryConfig as any)?.localization
      ?.defaultLocale

    // For category entities, the by-linkid API echoes the queried slug in
    // entity.linkId rather than the canonical default-locale slug. Use the
    // category tree (URL field) to resolve the canonical slug for the
    // defaultLocale instead.
    const tree = isCategory(root)
      ? await commerce.catalog.category.tree(10)
      : null

    return configuredLocales
      .map((configuredLocale) => {
        if (configuredLocale === currentLocale) {
          // The input slug is already the localized path for the current locale.
          return { locale: configuredLocale, slug }
        }

        // Build the full path by joining each segment's localized linkId.
        // If any segment has no availableLinkIds entry for this locale, omit it
        // to keep the hreflang cluster symmetric.
        const parts: string[] = []

        for (const entity of entities) {
          const linkId =
            entity.availableLinkIds?.[configuredLocale] ??
            (configuredLocale === defaultLocale &&
            tree !== null &&
            isCategory(entity)
              ? (findCanonicalSlug(tree, entity.id) ?? undefined)
              : undefined)

          if (!linkId) return null

          parts.push(linkId)
        }

        return parts.length > 0
          ? { locale: configuredLocale, slug: parts.join('/') }
          : null
      })
      .filter((e): e is { locale: string; slug: string } => e !== null)
  },
}
