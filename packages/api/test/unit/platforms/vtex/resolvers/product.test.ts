import { describe, expect, it, vi } from 'vitest'

import { StoreProduct } from '../../../../../src/platforms/vtex/resolvers/product'

// Minimal root object that satisfies the fields used by breadcrumbList and otherLocales.
function makeRoot({
  productId = 'prod1',
  linkText = 'blue-shirt',
  // IS category name paths — each entry is the full slash-separated path for one tree,
  // e.g. "Apparel/T-Shirts" means the product is in T-Shirts under Apparel.
  categories = ['Apparel/T-Shirts'],
  // IS category ID trees — each entry is a slash-separated path like "/1/2/".
  categoriesIds = ['/1/2/'],
  categoryId = '2',
  productName = 'Blue Shirt',
  itemId = '100',
}: {
  productId?: string
  linkText?: string
  categories?: string[]
  categoriesIds?: string[]
  categoryId?: string
  productName?: string
  itemId?: string
} = {}) {
  return {
    itemId,
    name: null,
    isVariantOf: {
      productId,
      productName,
      linkText,
      categories,
      categoriesIds,
      categoryId,
      brand: '',
      description: '',
      productTitle: '',
      metaTagDescription: '',
      manufacturerCode: null,
      skuSpecifications: [],
      specificationGroups: [],
      releaseDate: null,
      advertisement: null,
      deliveryPromisesBadges: [],
    },
    sellers: [],
    images: [],
    variations: [],
    attributes: [],
    attachmentsValues: [],
    unitMultiplier: 1,
  } as any
}

// Minimal context object for resolver tests.
function makeCtx({
  localizationEnabled = false,
  locale = 'en-US',
  locales = {},
  defaultLocale = 'en-US',
  getLocalizedProduct = vi.fn(),
  cache = undefined,
}: {
  localizationEnabled?: boolean
  locale?: string
  locales?: Record<string, unknown>
  defaultLocale?: string
  getLocalizedProduct?: (...args: any[]) => Promise<any>
  cache?: Map<string, any>
} = {}) {
  return {
    discoveryConfig: {
      localization: localizationEnabled
        ? { enabled: true, locales, defaultLocale }
        : undefined,
    },
    storage: {
      locale,
      productTranslationsCache: cache,
    },
    clients: {
      catalog: { getLocalizedProduct },
    },
  } as any
}

describe('StoreProduct', () => {
  describe('breadcrumbList', () => {
    it('falls back to IS-based slugs when localization is disabled', async () => {
      const root = makeRoot()
      const ctx = makeCtx()

      const result = await (StoreProduct.breadcrumbList as any)(root, {}, ctx)

      expect(result.numberOfItems).toBe(2)
      expect(result.itemListElement).toHaveLength(3)
      expect(result.itemListElement[0]).toMatchObject({
        name: 'Apparel',
        item: '/apparel/',
        position: 1,
      })
      expect(result.itemListElement[1]).toMatchObject({
        name: 'T-Shirts',
        item: '/apparel/t-shirts/',
        position: 2,
      })
      expect(result.itemListElement[2]).toMatchObject({
        name: 'Blue Shirt',
        item: '/blue-shirt-100/p',
        position: 3,
      })
    })

    it('returns localized breadcrumb when Catalog Dataplane returns matching categories', async () => {
      const getLocalizedProduct = vi.fn().mockResolvedValueOnce({
        linkId: 'camisa-azul',
        categories: [
          {
            id: 1,
            name: 'Vestuario',
            fullPath: '1',
            fullPathUriName: 'vestuario',
          },
          {
            id: 2,
            name: 'Camisetas',
            fullPath: '1/2',
            fullPathUriName: 'vestuario/camisetas',
          },
        ],
        availableLinkIds: { 'pt-BR': 'camisa-azul' },
      })

      const root = makeRoot()
      const ctx = makeCtx({
        localizationEnabled: true,
        locale: 'pt-BR',
        getLocalizedProduct,
      })

      const result = await (StoreProduct.breadcrumbList as any)(root, {}, ctx)

      expect(result.itemListElement[0]).toMatchObject({
        name: 'Vestuario',
        item: '/vestuario/',
        position: 1,
      })
      expect(result.itemListElement[1]).toMatchObject({
        name: 'Camisetas',
        item: '/vestuario/camisetas/',
        position: 2,
      })
      // Product item URL uses the localized linkId from Dataplane.
      expect(result.itemListElement[2]).toMatchObject({
        name: 'Blue Shirt',
        item: '/camisa-azul-100/p',
        position: 3,
      })
    })

    it('falls back to IS slugs when Dataplane returns fewer categories than IS expects', async () => {
      // Dataplane returns only the leaf category; IS expects 2 (Apparel + T-Shirts).
      // hasAllBreadcrumbLevels = false → falls through to the IS fallback.
      const getLocalizedProduct = vi.fn().mockResolvedValueOnce({
        linkId: 'camisa-azul',
        categories: [
          {
            id: 2,
            name: 'Camisetas',
            fullPath: '1/2',
            fullPathUriName: 'vestuario/camisetas',
          },
        ],
        availableLinkIds: {},
      })

      const root = makeRoot()
      const ctx = makeCtx({
        localizationEnabled: true,
        locale: 'pt-BR',
        getLocalizedProduct,
      })

      const result = await (StoreProduct.breadcrumbList as any)(root, {}, ctx)

      expect(result.itemListElement[0]).toMatchObject({ item: '/apparel/' })
      expect(result.itemListElement[1]).toMatchObject({
        item: '/apparel/t-shirts/',
      })
      expect(result.itemListElement[2]).toMatchObject({
        item: '/blue-shirt-100/p',
      })
    })

    it('falls back to IS slugs when Dataplane call throws', async () => {
      const getLocalizedProduct = vi
        .fn()
        .mockRejectedValueOnce(new Error('Dataplane unavailable'))

      const root = makeRoot()
      const ctx = makeCtx({
        localizationEnabled: true,
        locale: 'pt-BR',
        getLocalizedProduct,
      })

      const result = await (StoreProduct.breadcrumbList as any)(root, {}, ctx)

      expect(result.itemListElement[0]).toMatchObject({ item: '/apparel/' })
      expect(result.itemListElement[2]).toMatchObject({
        item: '/blue-shirt-100/p',
      })
    })

    it('reuses a cached entry and skips the API call', async () => {
      const cachedEntry = {
        linkId: 'camisa-azul',
        categories: [
          {
            id: 1,
            name: 'Vestuario',
            fullPath: '1',
            fullPathUriName: 'vestuario',
          },
          {
            id: 2,
            name: 'Camisetas',
            fullPath: '1/2',
            fullPathUriName: 'vestuario/camisetas',
          },
        ],
        availableLinkIds: {},
      }
      // Cache key is `${productId}:${locale}` → "prod1:pt-BR"
      const cache = new Map([['prod1:pt-BR', cachedEntry]])
      const getLocalizedProduct = vi.fn()

      const root = makeRoot()
      const ctx = makeCtx({
        localizationEnabled: true,
        locale: 'pt-BR',
        getLocalizedProduct,
        cache,
      })

      await (StoreProduct.breadcrumbList as any)(root, {}, ctx)

      expect(getLocalizedProduct).not.toHaveBeenCalled()
    })
  })

  describe('otherLocales', () => {
    it('returns null when localization is disabled', async () => {
      const result = await (StoreProduct.otherLocales as any)(
        makeRoot(),
        {},
        makeCtx()
      )

      expect(result).toBeNull()
    })

    it('returns null when no locales are configured', async () => {
      const result = await (StoreProduct.otherLocales as any)(
        makeRoot(),
        {},
        makeCtx({ localizationEnabled: true, locales: {} })
      )

      expect(result).toBeNull()
    })

    it('returns localized slugs for configured locales', async () => {
      const getLocalizedProduct = vi.fn().mockResolvedValueOnce({
        linkId: 'blue-shirt',
        categories: [],
        availableLinkIds: { 'pt-BR': 'camisa-azul' },
      })

      const root = makeRoot()
      const ctx = makeCtx({
        localizationEnabled: true,
        locale: 'en-US',
        locales: { 'en-US': {}, 'pt-BR': {} },
        defaultLocale: 'en-US',
        getLocalizedProduct,
      })

      const result = await (StoreProduct.otherLocales as any)(root, {}, ctx)

      // Default locale always uses the canonical IS linkText.
      expect(result).toContainEqual({ locale: 'en-US', slug: 'blue-shirt-100' })
      // Non-default locale uses the translated linkId from availableLinkIds.
      expect(result).toContainEqual({
        locale: 'pt-BR',
        slug: 'camisa-azul-100',
      })
    })

    it('omits non-default locales with no entry in availableLinkIds', async () => {
      const getLocalizedProduct = vi.fn().mockResolvedValueOnce({
        linkId: 'blue-shirt',
        categories: [],
        availableLinkIds: {}, // pt-BR not translated
      })

      const root = makeRoot()
      const ctx = makeCtx({
        localizationEnabled: true,
        locale: 'en-US',
        locales: { 'en-US': {}, 'pt-BR': {} },
        defaultLocale: 'en-US',
        getLocalizedProduct,
      })

      const result = await (StoreProduct.otherLocales as any)(root, {}, ctx)

      expect(result).toContainEqual({ locale: 'en-US', slug: 'blue-shirt-100' })
      expect(result?.find((e: any) => e.locale === 'pt-BR')).toBeUndefined()
    })

    it('returns null when the Dataplane API throws', async () => {
      const getLocalizedProduct = vi
        .fn()
        .mockRejectedValueOnce(new Error('API error'))

      const ctx = makeCtx({
        localizationEnabled: true,
        locale: 'en-US',
        locales: { 'en-US': {}, 'pt-BR': {} },
        defaultLocale: 'en-US',
        getLocalizedProduct,
      })

      const result = await (StoreProduct.otherLocales as any)(
        makeRoot(),
        {},
        ctx
      )

      expect(result).toBeNull()
    })

    it('reuses a cached entry with availableLinkIds and skips the API call', async () => {
      const cachedEntry = {
        linkId: 'blue-shirt',
        categories: [],
        availableLinkIds: { 'pt-BR': 'camisa-azul' },
      }
      // Cache key is `${productId}:${locale}` → "prod1:en-US"
      const cache = new Map([['prod1:en-US', cachedEntry]])
      const getLocalizedProduct = vi.fn()

      const root = makeRoot()
      const ctx = makeCtx({
        localizationEnabled: true,
        locale: 'en-US',
        locales: { 'en-US': {}, 'pt-BR': {} },
        defaultLocale: 'en-US',
        getLocalizedProduct,
        cache,
      })

      await (StoreProduct.otherLocales as any)(root, {}, ctx)

      expect(getLocalizedProduct).not.toHaveBeenCalled()
    })
  })

  describe('releaseDate', () => {
    const resolve = (releaseDate: unknown) =>
      (StoreProduct.releaseDate as any)({ isVariantOf: { releaseDate } })

    it('converts epoch milliseconds to an ISO calendar date', () => {
      expect(resolve('1774224000000')).toBe('2026-03-23')
    })

    it('converts epoch seconds to the same date as its millisecond form', () => {
      expect(resolve('1774224000')).toBe(resolve('1774224000000'))
    })

    it('reads a value at the millisecond threshold as milliseconds', () => {
      expect(resolve('100000000000')).toBe('1973-03-03')
    })

    it('reads a value just below the threshold as seconds', () => {
      expect(resolve('99999999999')).toBe('5138-11-16')
    })

    it('accepts a numeric epoch, not only its string form', () => {
      expect(resolve(1774224000000)).toBe('2026-03-23')
    })

    it('passes an ISO date through unchanged', () => {
      expect(resolve('2026-03-23')).toBe('2026-03-23')
    })

    it('truncates an ISO datetime to its calendar date', () => {
      expect(resolve('2026-03-23T14:30:00Z')).toBe('2026-03-23')
    })

    // UTC is deliberate: preserving the source calendar day would make the
    // output depend on the offset embedded in each record.
    it('resolves an offset that crosses midnight to the UTC day', () => {
      expect(resolve('2026-03-23T21:00:00-05:00')).toBe('2026-03-24')
    })

    it.each([
      ['an empty string', ''],
      ['whitespace', '   '],
      ['an unparseable value', 'not-a-date'],
      ['null', null],
      ['undefined', undefined],
    ])('returns an empty string for %s', (_label, input) => {
      expect(resolve(input)).toBe('')
    })

    it('never returns "Invalid Date"', () => {
      expect(resolve('garbage')).not.toContain('Invalid')
    })
  })
})
