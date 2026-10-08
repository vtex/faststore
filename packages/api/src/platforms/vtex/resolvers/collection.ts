import type { GraphqlContext, GraphqlResolver } from '..'
import type { Brand } from '../clients/commerce/types/Brand'
import type { CategoryTree } from '../clients/commerce/types/CategoryTree'
import type { CollectionPageType } from '../clients/commerce/types/Portal'
import {
  isBrand,
  isCategory,
  isCollection,
  type ByLinkIdBrandRoot,
  type ByLinkIdCategoryRoot,
  type ByLinkIdCollectionRoot,
} from '../loaders/collection'
import { getCatalogLocale, getLocalizationConfig } from '../utils/localization'
import { slugify } from '../utils/slugify'

type ByLinkIdRoot =
  | ByLinkIdCategoryRoot
  | ByLinkIdBrandRoot
  | ByLinkIdCollectionRoot

/**
 * @deprecated Legacy pagetype-based shape. It is no longer produced at runtime
 * since the by-linkid migration and only remains in the public `Root` union to
 * avoid a breaking change for stores that still reference `StoreCollectionRoot`.
 *
 * TODO: remove in the next major of `@faststore/api` (drop from the `Root`
 * union below) — this is a breaking change and must ship with a BREAKING CHANGE note.
 */
export type LegacyStoreCollectionRoot =
  | Brand
  | (CategoryTree & { level: number })
  | CollectionPageType

/**
 * Public `StoreCollectionRoot` type (re-exported from the package entrypoint).
 * Kept as a backward-compatible superset: the legacy members are retained
 * (see {@link LegacyStoreCollectionRoot}) so existing consumers keep compiling,
 * while `ByLinkIdRoot` reflects the real runtime shape.
 */
export type Root = ByLinkIdRoot | LegacyStoreCollectionRoot

/**
 * Lowercases a catalog slug so one spelling is announced per locale.
 *
 * Merchants register linkIds in whatever casing they typed ("Elettronica",
 * "Eletronicos"), and by-linkid resolves any casing, so without this every
 * variant would be a legitimate URL advertising itself as canonical. Accents
 * are preserved: they are part of the registered slug, not a casing artifact.
 */
const canonicalizeSlug = (slug: string): string => slug.toLowerCase()

/**
 * Loads the by-linkid entity for every level of a collection slug, so
 * "vestuario/camisetas" resolves both "vestuario" and "vestuario/camisetas".
 * The collectionLoader cache means a segment already fetched by another
 * resolver of the same request costs nothing here.
 */
const loadSegmentEntities = (
  ctx: GraphqlContext,
  slug: string
): Promise<ByLinkIdRoot[]> => {
  const segments = slug.split('/').filter(Boolean)
  const {
    loaders: { collectionLoader },
  } = ctx

  return Promise.all(
    segments.map((_, index) =>
      collectionLoader.load({
        slug: segments.slice(0, index + 1).join('/'),
        locale: getCatalogLocale(ctx),
      })
    )
  )
}

const slugifyRoot = (root: ByLinkIdRoot): string => {
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

export const StoreCollection: Record<string, GraphqlResolver<ByLinkIdRoot>> = {
  id: ({ id }) => id.toString(),
  slug: (root) => slugifyRoot(root),
  seo: (root) => ({
    title: root.title ?? root.name,
    // pagetype.metaTagDescription and catalog `description` share the same
    // source (confirmed with Catalog). Prefer metaTagDescription when present
    // for forward-compat; fall back to description for by-linkid parity.
    description: root.metaTagDescription ?? root.description,
  }),
  type: (root) => {
    if (isBrand(root)) return 'Brand'
    // Clusters and curated collections share the collection/by-linkid endpoint,
    // whose response has no discriminator between them, so both report as
    // 'Collection'. The enum still declares 'Cluster' for backward compat.
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
    // regardless of which locale the current request uses. `linkId` carries the slug
    // registered for the *requested* locale, so it is the wrong one here whenever the
    // shopper is browsing anything but the default locale; availableLinkIds is keyed by
    // locale and gives us the default-locale slug directly.
    const { defaultLocale } = getLocalizationConfig(ctx)

    const entities = await loadSegmentEntities(ctx, slug)

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
    const collections = await loadSegmentEntities(ctx, slugifyRoot(root))

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

    const slug = slugifyRoot(root)

    if (slug.split('/').filter(Boolean).length === 0) return null

    let entities: ByLinkIdRoot[]

    try {
      entities = await loadSegmentEntities(ctx, slug)
    } catch (err) {
      console.warn('[otherLocales] failed to load collection entities:', err)

      return null
    }

    return configuredLocales
      .map((configuredLocale) => {
        // Every locale, including the one being rendered, is read from
        // availableLinkIds, which holds registered translations only. by-linkid
        // resolves an untranslated segment by falling back to a slug that
        // exists in another locale, so trusting its `linkId` here would
        // advertise an alternate the target locale never registered and break
        // the reciprocity hreflang requires. The page still declares itself
        // canonical through `canonicalSlug`, which is free to fall back
        // precisely because it is not an hreflang annotation.
        const parts: string[] = []

        for (const entity of entities) {
          const linkId = entity.availableLinkIds?.[configuredLocale]

          if (!linkId) return null

          parts.push(linkId)
        }

        return parts.length > 0
          ? {
              locale: configuredLocale,
              slug: canonicalizeSlug(parts.join('/')),
            }
          : null
      })
      .filter((e): e is { locale: string; slug: string } => e !== null)
  },

  canonicalSlug: async (root, _, ctx) => {
    const slug = slugifyRoot(root)

    if (slug.split('/').filter(Boolean).length === 0) return null

    let entities: ByLinkIdRoot[]

    try {
      entities = await loadSegmentEntities(ctx, slug)
    } catch (err) {
      console.warn('[canonicalSlug] failed to load collection entities:', err)

      return null
    }

    const parts = entities.map((entity) => entity.linkId)

    // A segment with no linkId leaves nothing better than the visited slug to
    // announce, so the page keeps describing itself by the path it was reached
    // through.
    return parts.every((part): part is string => Boolean(part))
      ? canonicalizeSlug(parts.join('/'))
      : canonicalizeSlug(slug)
  },
}
