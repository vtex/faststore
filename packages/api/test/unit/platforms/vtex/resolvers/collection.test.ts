import { afterEach, describe, expect, it, vi } from 'vitest'

import { StoreCollection } from '../../../../../src/platforms/vtex/resolvers/collection'
import { Query } from '../../../../../src/platforms/vtex/resolvers/query'
import { slugify } from '../../../../../src/platforms/vtex/utils/slugify'

// ─── Root fixtures ──────────────────────────────────────────────────────────

const makeCategoryRoot = (overrides: Record<string, unknown> = {}) => ({
  entityType: 'category' as const,
  id: 1,
  fatherCategoryId: null,
  name: 'Apparel',
  linkId: 'apparel',
  // Full accumulated input slug injected by the loader.
  slug: 'apparel',
  title: null,
  description: null,
  metaTagDescription: null,
  availableLinkIds: null,
  ...overrides,
})

const makeBrandRoot = (overrides: Record<string, unknown> = {}) => ({
  entityType: 'brand' as const,
  id: 10,
  name: 'Adidas',
  linkId: 'adidas',
  title: null,
  description: null,
  metaTagDescription: null,
  availableLinkIds: null,
  ...overrides,
})

const makeCollectionRoot = (overrides: Record<string, unknown> = {}) => ({
  entityType: 'collection' as const,
  id: 42,
  name: 'Summer Sale',
  linkId: 'summer-sale',
  title: null,
  description: null,
  metaTagDescription: null,
  availableLinkIds: null,
  ...overrides,
})

// ─── Context stub ─────────────────────────────────────────────────────────────

type LoadFn = (key: { slug: string; locale?: string }) => Promise<unknown>

function makeCtx({
  localizationEnabled = false,
  locale = 'en-US',
  locales = {} as Record<string, unknown>,
  defaultLocale = 'en-US',
  load = vi.fn() as unknown as LoadFn,
}: {
  localizationEnabled?: boolean
  locale?: string
  locales?: Record<string, unknown>
  defaultLocale?: string
  load?: LoadFn
} = {}) {
  return {
    storage: { locale },
    discoveryConfig: {
      localization: localizationEnabled
        ? { enabled: true, locales, defaultLocale }
        : undefined,
    },
    loaders: { collectionLoader: { load } },
  } as any
}

/** Loader stub that resolves entities from a slug->entity map. */
const loaderFor = (map: Record<string, unknown>): LoadFn =>
  vi.fn(({ slug }: { slug: string }) => {
    if (!(slug in map)) {
      throw new Error(`unexpected load for slug: ${slug}`)
    }
    return Promise.resolve(map[slug])
  })

const call = (fn: any, root: unknown, ctx?: unknown) => fn(root, {}, ctx)

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('StoreCollection', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('slug', () => {
    it('uses the injected full slug for categories', () => {
      const root = makeCategoryRoot({ slug: 'vestuario/camisetas' })
      expect(call(StoreCollection.slug, root)).toBe('vestuario/camisetas')
    })

    it('uses linkId for brands', () => {
      expect(call(StoreCollection.slug, makeBrandRoot())).toBe('adidas')
    })

    it('uses linkId for collections when present', () => {
      expect(call(StoreCollection.slug, makeCollectionRoot())).toBe(
        'summer-sale'
      )
    })

    it('falls back to slugify(name) for collections with null linkId', () => {
      const root = makeCollectionRoot({ linkId: null, name: 'Summer Sale' })
      expect(call(StoreCollection.slug, root)).toBe(slugify('Summer Sale'))
    })
  })

  describe('seo', () => {
    it('prefers title, falling back to name', () => {
      expect(
        call(StoreCollection.seo, makeCategoryRoot({ title: 'T' }))
      ).toEqual({ title: 'T', description: null })
      expect(
        call(StoreCollection.seo, makeCategoryRoot({ title: null, name: 'N' }))
      ).toMatchObject({ title: 'N' })
    })

    it('prefers metaTagDescription, falling back to description', () => {
      expect(
        call(StoreCollection.seo, makeCategoryRoot({ metaTagDescription: 'M' }))
      ).toMatchObject({ description: 'M' })
      expect(
        call(
          StoreCollection.seo,
          makeCategoryRoot({ metaTagDescription: null, description: 'D' })
        )
      ).toMatchObject({ description: 'D' })
    })
  })

  describe('type', () => {
    it('returns Brand for brand roots', () => {
      expect(call(StoreCollection.type, makeBrandRoot())).toBe('Brand')
    })

    it('returns Collection for collection roots', () => {
      expect(call(StoreCollection.type, makeCollectionRoot())).toBe(
        'Collection'
      )
    })

    it('returns Department for a root category (no parent)', () => {
      expect(
        call(StoreCollection.type, makeCategoryRoot({ fatherCategoryId: null }))
      ).toBe('Department')
    })

    it('returns Category for a nested category', () => {
      expect(
        call(StoreCollection.type, makeCategoryRoot({ fatherCategoryId: 5 }))
      ).toBe('Category')
    })
  })

  describe('meta', () => {
    it('builds a brand facet', async () => {
      const result = await call(
        StoreCollection.meta,
        makeBrandRoot(),
        makeCtx()
      )
      expect(result).toEqual({
        selectedFacets: [{ key: 'brand', value: 'adidas' }],
      })
    })

    it('builds a productclusterids facet for collections', async () => {
      const result = await call(
        StoreCollection.meta,
        makeCollectionRoot({ id: 99 }),
        makeCtx()
      )
      expect(result).toEqual({
        selectedFacets: [{ key: 'productclusterids', value: 99 }],
      })
    })

    it('uses availableLinkIds[defaultLocale] for category facets', async () => {
      const load = loaderFor({
        vestuario: makeCategoryRoot({
          slug: 'vestuario',
          linkId: 'vestuario',
          availableLinkIds: { 'en-US': 'apparel', 'pt-BR': 'vestuario' },
        }),
      })
      const ctx = makeCtx({
        localizationEnabled: true,
        locale: 'pt-BR',
        defaultLocale: 'en-US',
        locales: { 'en-US': {}, 'pt-BR': {} },
        load,
      })

      const result = await call(
        StoreCollection.meta,
        makeCategoryRoot({ slug: 'vestuario' }),
        ctx
      )

      expect(result).toEqual({
        selectedFacets: [{ key: 'category-1', value: 'apparel' }],
      })
    })

    it('falls back to linkId when availableLinkIds is absent', async () => {
      const load = loaderFor({
        apparel: makeCategoryRoot({ slug: 'apparel', linkId: 'apparel' }),
      })
      const ctx = makeCtx({
        localizationEnabled: true,
        defaultLocale: 'en-US',
        locales: { 'en-US': {} },
        load,
      })

      const result = await call(
        StoreCollection.meta,
        makeCategoryRoot({ slug: 'apparel' }),
        ctx
      )

      expect(result).toEqual({
        selectedFacets: [{ key: 'category-1', value: 'apparel' }],
      })
    })

    it('builds one facet per segment for multi-segment categories', async () => {
      const load = loaderFor({
        vestuario: makeCategoryRoot({ slug: 'vestuario', linkId: 'vestuario' }),
        'vestuario/camisetas': makeCategoryRoot({
          slug: 'vestuario/camisetas',
          linkId: 'camisetas',
        }),
      })
      const ctx = makeCtx({ load })

      const result = await call(
        StoreCollection.meta,
        makeCategoryRoot({ slug: 'vestuario/camisetas' }),
        ctx
      )

      expect(result).toEqual({
        selectedFacets: [
          { key: 'category-1', value: 'vestuario' },
          { key: 'category-2', value: 'camisetas' },
        ],
      })
    })
  })

  describe('breadcrumbList', () => {
    it('builds a single-level breadcrumb', async () => {
      const load = loaderFor({
        apparel: makeCategoryRoot({ slug: 'apparel', name: 'Apparel' }),
      })
      const ctx = makeCtx({ load })

      const result = await call(
        StoreCollection.breadcrumbList,
        makeCategoryRoot({ slug: 'apparel' }),
        ctx
      )

      expect(result.numberOfItems).toBe(1)
      expect(result.itemListElement).toEqual([
        { item: '/apparel', name: 'Apparel', position: 1 },
      ])
    })

    it('builds a multi-segment breadcrumb from prefix paths', async () => {
      const load = loaderFor({
        vestuario: makeCategoryRoot({ slug: 'vestuario', name: 'Vestuário' }),
        'vestuario/camisetas': makeCategoryRoot({
          slug: 'vestuario/camisetas',
          name: 'Camisetas',
        }),
      })
      const ctx = makeCtx({ load })

      const result = await call(
        StoreCollection.breadcrumbList,
        makeCategoryRoot({ slug: 'vestuario/camisetas' }),
        ctx
      )

      expect(result.numberOfItems).toBe(2)
      expect(result.itemListElement).toEqual([
        { item: '/vestuario', name: 'Vestuário', position: 1 },
        { item: '/vestuario/camisetas', name: 'Camisetas', position: 2 },
      ])
    })
  })

  describe('otherLocales', () => {
    it('returns null when localization is disabled', async () => {
      const result = await call(
        StoreCollection.otherLocales,
        makeCategoryRoot(),
        makeCtx({ localizationEnabled: false })
      )
      expect(result).toBeNull()
    })

    it('returns null when no locales are configured', async () => {
      const result = await call(
        StoreCollection.otherLocales,
        makeCategoryRoot(),
        makeCtx({ localizationEnabled: true, locales: {} })
      )
      expect(result).toBeNull()
    })

    it('returns null when the slug has no segments', async () => {
      const result = await call(
        StoreCollection.otherLocales,
        makeCategoryRoot({ slug: '' }),
        makeCtx({
          localizationEnabled: true,
          locales: { 'en-US': {}, 'pt-BR': {} },
        })
      )
      expect(result).toBeNull()
    })

    it('echoes the input slug for the current locale and joins availableLinkIds for others', async () => {
      const load = loaderFor({
        vestuario: makeCategoryRoot({
          slug: 'vestuario',
          availableLinkIds: { 'en-US': 'apparel', 'pt-BR': 'vestuario' },
        }),
      })
      const ctx = makeCtx({
        localizationEnabled: true,
        locale: 'pt-BR',
        locales: { 'en-US': {}, 'pt-BR': {} },
        load,
      })

      const result = await call(
        StoreCollection.otherLocales,
        makeCategoryRoot({ slug: 'vestuario' }),
        ctx
      )

      expect(result).toContainEqual({ locale: 'pt-BR', slug: 'vestuario' })
      expect(result).toContainEqual({ locale: 'en-US', slug: 'apparel' })
    })

    it('joins per-segment localized linkIds for multi-segment slugs', async () => {
      const load = loaderFor({
        vestuario: makeCategoryRoot({
          slug: 'vestuario',
          availableLinkIds: { 'en-US': 'apparel', 'pt-BR': 'vestuario' },
        }),
        'vestuario/camisetas': makeCategoryRoot({
          slug: 'vestuario/camisetas',
          availableLinkIds: { 'en-US': 't-shirts', 'pt-BR': 'camisetas' },
        }),
      })
      const ctx = makeCtx({
        localizationEnabled: true,
        locale: 'pt-BR',
        locales: { 'en-US': {}, 'pt-BR': {} },
        load,
      })

      const result = await call(
        StoreCollection.otherLocales,
        makeCategoryRoot({ slug: 'vestuario/camisetas' }),
        ctx
      )

      expect(result).toContainEqual({
        locale: 'en-US',
        slug: 'apparel/t-shirts',
      })
    })

    it('omits a locale when any segment lacks its linkId', async () => {
      const load = loaderFor({
        vestuario: makeCategoryRoot({
          slug: 'vestuario',
          availableLinkIds: { 'en-US': 'apparel', 'pt-BR': 'vestuario' },
        }),
        'vestuario/camisetas': makeCategoryRoot({
          slug: 'vestuario/camisetas',
          // no en-US entry for the leaf → en-US must be omitted entirely
          availableLinkIds: { 'pt-BR': 'camisetas' },
        }),
      })
      const ctx = makeCtx({
        localizationEnabled: true,
        locale: 'pt-BR',
        locales: { 'en-US': {}, 'pt-BR': {} },
        load,
      })

      const result = await call(
        StoreCollection.otherLocales,
        makeCategoryRoot({ slug: 'vestuario/camisetas' }),
        ctx
      )

      expect(result).toContainEqual({
        locale: 'pt-BR',
        slug: 'vestuario/camisetas',
      })
      expect(result.some((e: { locale: string }) => e.locale === 'en-US')).toBe(
        false
      )
    })

    it('returns null and warns when the loader throws', async () => {
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
      const load = vi.fn(() =>
        Promise.reject(new Error('by-linkid down'))
      ) as unknown as LoadFn
      const ctx = makeCtx({
        localizationEnabled: true,
        locale: 'pt-BR',
        locales: { 'en-US': {}, 'pt-BR': {} },
        load,
      })

      const result = await call(
        StoreCollection.otherLocales,
        makeCategoryRoot({ slug: 'vestuario' }),
        ctx
      )

      expect(result).toBeNull()
      expect(warn).toHaveBeenCalled()
    })
  })
})

describe('Query.collection', () => {
  it('forwards the request locale (from context) on the load key', () => {
    // The locale is set on ctx.storage.locale by the core `execute` wrapper
    // (Next.js i18n), not via a GraphQL argument. The resolver only reads it.
    const load = vi.fn(() => Promise.resolve({}))
    const ctx = makeCtx({
      localizationEnabled: true,
      locale: 'pt-BR',
      locales: { 'en-US': {}, 'pt-BR': {} },
      load,
    })
    ;(Query.collection as any)(null, { slug: 'vestuario' }, ctx)

    expect(load).toHaveBeenCalledWith({ slug: 'vestuario', locale: 'pt-BR' })
  })

  it('sends no catalog locale when localization is disabled', () => {
    const load = vi.fn(() => Promise.resolve({}))
    const ctx = makeCtx({
      localizationEnabled: false,
      locale: 'pt-BR',
      load,
    })
    ;(Query.collection as any)(null, { slug: 'apparel' }, ctx)

    expect(load).toHaveBeenCalledWith({ slug: 'apparel', locale: undefined })
  })
})
