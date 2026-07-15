import type { GraphqlContext, GraphqlResolver } from '..'
import {
  isBrand,
  isCategory,
  isCollection,
  type ByLinkIdBrandRoot,
  type ByLinkIdCategoryRoot,
  type ByLinkIdCollectionRoot,
} from '../loaders/collection'
import { slugify } from '../utils/slugify'

interface LocalizationConfig {
  enabled?: boolean
  defaultLocale?: string
  locales?: Record<string, unknown>
}

function getLocalizationConfig(ctx: GraphqlContext): LocalizationConfig {
  return (
    (ctx.discoveryConfig as { localization?: LocalizationConfig } | undefined)
      ?.localization ?? {}
  )
}

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

    // For categories, IS expects the canonical (default-locale) slug in selectedFacets
    // regardless of which locale the current request uses. The by-linkid API echoes the
    // queried slug in `linkId`, so we resolve canonical via availableLinkIds[defaultLocale].
    const { defaultLocale } = getLocalizationConfig(ctx)

    const segments = slug.split('/').filter(Boolean)
    const segmentSlugs = segments.map((_, i) =>
      segments.slice(0, i + 1).join('/')
    )

    const {
      loaders: { collectionLoader },
    } = ctx

    const entities = await Promise.all(
      segmentSlugs.map((s) => collectionLoader.load(s))
    )

    return {
      selectedFacets: entities.map((entity, index) => ({
        key: `category-${index + 1}`,
        value:
          (defaultLocale && entity.availableLinkIds?.[defaultLocale]) ||
          entity.linkId,
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
    const localizationConfig = getLocalizationConfig(ctx)

    if (!localizationConfig.enabled) return null

    const configuredLocales = Object.keys(localizationConfig.locales ?? {})

    if (configuredLocales.length === 0) return null

    const currentLocale = ctx.storage.locale
    const slug = slugifyRoot(root)
    const segments = slug.split('/').filter(Boolean)

    if (segments.length === 0) return null

    const {
      loaders: { collectionLoader },
    } = ctx

    // Build per-level slug paths: ["vestuario", "vestuario/camisetas"].
    // The collectionLoader DataLoader cache means any segment already fetched
    // by breadcrumbList or meta costs nothing here.
    const segmentSlugs = segments.map((_, i) =>
      segments.slice(0, i + 1).join('/')
    )

    let entities: Root[]

    try {
      entities = await Promise.all(
        segmentSlugs.map((s) => collectionLoader.load(s))
      )
    } catch (err) {
      console.warn('[otherLocales] failed to load collection entities:', err)

      return null
    }

    return configuredLocales
      .map((configuredLocale) => {
        if (configuredLocale === currentLocale) {
          // The input slug is already the localized path for the current locale.
          return { locale: configuredLocale, slug }
        }

        // Build the full path by joining each segment's localized linkId from
        // availableLinkIds. For the default locale, the canonical slug is also
        // present in availableLinkIds.
        // If any segment is missing an entry for this locale, omit the whole URL
        // to keep the hreflang cluster symmetric.
        const parts: string[] = []

        for (const entity of entities) {
          const linkId = entity.availableLinkIds?.[configuredLocale]

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
