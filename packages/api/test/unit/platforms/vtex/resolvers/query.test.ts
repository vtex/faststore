import { describe, expect, it, vi } from 'vitest'

import { NotFoundError } from '../../../../../src/platforms/errors'
import { Query } from '../../../../../src/platforms/vtex/resolvers/query'

// ─── Fixtures ───────────────────────────────────────────────────────────────

function makeSku(isVariantOfOverrides: Record<string, unknown> = {}) {
  return {
    itemId: '100',
    sellers: [],
    isVariantOf: {
      linkText: 'blue-shirt',
      productId: 'prod1',
      ...isVariantOfOverrides,
    },
  } as any
}

function makeSearchProduct(overrides: Record<string, unknown> = {}) {
  return {
    productId: 'prod1',
    linkText: 'blue-shirt',
    items: [{ itemId: '55', sellers: [{ commertialOffer: {} }] }],
    ...overrides,
  } as any
}

type Locator = Array<{ key: string; value: string }>

function makeCtx({
  localizationEnabled = false,
  locale = 'en-US',
  locales = {},
  defaultLocale = 'en-US',
  load = vi.fn(),
  getLocalizedProduct = vi.fn(),
  pagetype = vi.fn(),
  fetchProduct = vi.fn(),
}: {
  localizationEnabled?: boolean
  locale?: string
  locales?: Record<string, unknown>
  defaultLocale?: string
  load?: (...args: any[]) => Promise<any>
  getLocalizedProduct?: (...args: any[]) => Promise<any>
  pagetype?: (...args: any[]) => Promise<any>
  fetchProduct?: (...args: any[]) => Promise<any>
} = {}) {
  return {
    storage: { locale },
    discoveryConfig: {
      localization: localizationEnabled
        ? { enabled: true, locales, defaultLocale }
        : undefined,
    },
    loaders: { skuLoader: { load } },
    clients: {
      catalog: { getLocalizedProduct },
      commerce: { catalog: { portal: { pagetype } } },
      search: { fetchProduct },
    },
  } as any
}

const callProduct = (locator: Locator, ctx: any) =>
  (Query.product as any)(null, { locator }, ctx)

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('Query.product', () => {
  describe('happy path (no fallback)', () => {
    it('loads the sku by id when only an id facet is present', async () => {
      const sku = makeSku()
      const load = vi.fn().mockResolvedValue(sku)
      const pagetype = vi.fn()
      const ctx = makeCtx({ load, pagetype })

      const result = await callProduct([{ key: 'id', value: '100' }], ctx)

      expect(load).toHaveBeenCalledWith('100')
      expect(result).toBe(sku)
      expect(pagetype).not.toHaveBeenCalled()
    })

    it('derives the skuId from the slug suffix when no id facet is present', async () => {
      const sku = makeSku()
      const load = vi.fn().mockResolvedValue(sku)
      const ctx = makeCtx({ load })

      await callProduct([{ key: 'slug', value: 'blue-shirt-100' }], ctx)

      expect(load).toHaveBeenCalledWith('100')
    })

    it('sets the channel on context when a channel facet is present', async () => {
      const load = vi.fn().mockResolvedValue(makeSku())
      const ctx = makeCtx({ load })
      const channel = JSON.stringify({ salesChannel: '2' })

      await callProduct(
        [
          { key: 'id', value: '100' },
          { key: 'channel', value: channel },
        ],
        ctx
      )

      expect(ctx.storage.channel).toMatchObject({ salesChannel: '2' })
    })

    it('sets the locale on context when a locale facet is present', async () => {
      const load = vi.fn().mockResolvedValue(makeSku())
      const ctx = makeCtx({ load })

      await callProduct(
        [
          { key: 'id', value: '100' },
          { key: 'locale', value: 'pt-BR' },
        ],
        ctx
      )

      expect(ctx.storage.locale).toBe('pt-BR')
    })

    it('returns the sku directly when the slug prefix matches linkText', async () => {
      const sku = makeSku({ linkText: 'blue-shirt' })
      const load = vi.fn().mockResolvedValue(sku)
      const ctx = makeCtx({ load })

      const result = await callProduct(
        [{ key: 'slug', value: 'blue-shirt-100' }],
        ctx
      )

      expect(result).toBe(sku)
    })
  })

  describe('localized slug validation', () => {
    it('returns the sku when the slug is a valid localized match', async () => {
      const sku = makeSku({ linkText: 'blue-shirt' })
      const load = vi.fn().mockResolvedValue(sku)
      const getLocalizedProduct = vi.fn().mockResolvedValue({
        linkId: 'camisa-azul',
        categories: [],
        availableLinkIds: {},
      })
      const pagetype = vi.fn()
      const ctx = makeCtx({
        load,
        getLocalizedProduct,
        pagetype,
        localizationEnabled: true,
        locale: 'pt-BR',
      })

      const result = await callProduct(
        [
          { key: 'slug', value: 'camisa-azul-100' },
          { key: 'locale', value: 'pt-BR' },
        ],
        ctx
      )

      expect(result).toBe(sku)
      expect(getLocalizedProduct).toHaveBeenCalledWith('prod1', 'pt-BR')
      expect(pagetype).not.toHaveBeenCalled()
    })

    it('falls back when localization is enabled but the localized linkId does not match', async () => {
      const load = vi
        .fn()
        .mockResolvedValue(makeSku({ linkText: 'blue-shirt' }))
      const getLocalizedProduct = vi.fn().mockResolvedValue({
        linkId: 'something-else',
        categories: [],
        availableLinkIds: {},
      })
      const pagetype = vi
        .fn()
        .mockResolvedValue({ pageType: 'Product', id: 55 })
      const fetchProduct = vi.fn().mockResolvedValue(makeSearchProduct())
      const ctx = makeCtx({
        load,
        getLocalizedProduct,
        pagetype,
        fetchProduct,
        localizationEnabled: true,
        locale: 'pt-BR',
      })

      await callProduct(
        [
          { key: 'slug', value: 'camisa-azul-100' },
          { key: 'locale', value: 'pt-BR' },
        ],
        ctx
      )

      expect(pagetype).toHaveBeenCalledWith('camisa-azul-100/p')
    })

    it('falls back without checking Dataplane when localization is disabled', async () => {
      const load = vi
        .fn()
        .mockResolvedValue(makeSku({ linkText: 'blue-shirt' }))
      const getLocalizedProduct = vi.fn()
      const pagetype = vi
        .fn()
        .mockResolvedValue({ pageType: 'Product', id: 55 })
      const fetchProduct = vi.fn().mockResolvedValue(makeSearchProduct())
      const ctx = makeCtx({
        load,
        getLocalizedProduct,
        pagetype,
        fetchProduct,
        localizationEnabled: false,
      })

      await callProduct([{ key: 'slug', value: 'red-shirt-100' }], ctx)

      expect(getLocalizedProduct).not.toHaveBeenCalled()
      expect(pagetype).toHaveBeenCalledWith('red-shirt-100/p')
    })

    it('falls back without checking Dataplane when no locale facet is present', async () => {
      const load = vi
        .fn()
        .mockResolvedValue(makeSku({ linkText: 'blue-shirt' }))
      const getLocalizedProduct = vi.fn()
      const pagetype = vi
        .fn()
        .mockResolvedValue({ pageType: 'Product', id: 55 })
      const fetchProduct = vi.fn().mockResolvedValue(makeSearchProduct())
      const ctx = makeCtx({
        load,
        getLocalizedProduct,
        pagetype,
        fetchProduct,
        localizationEnabled: true,
      })

      await callProduct([{ key: 'slug', value: 'red-shirt-100' }], ctx)

      expect(getLocalizedProduct).not.toHaveBeenCalled()
      expect(pagetype).toHaveBeenCalled()
    })
  })

  describe('fallback to the legacy product route', () => {
    it('falls back when the sku is not found by id', async () => {
      // A slug facet must also be present: the fallback route needs a slug to
      // resolve through `pagetype`, and is a no-op (BadRequestError) without one.
      const load = vi.fn().mockRejectedValue(new NotFoundError('no sku'))
      const pagetype = vi
        .fn()
        .mockResolvedValue({ pageType: 'Product', id: 55 })
      const fetchProduct = vi.fn().mockResolvedValue(makeSearchProduct())
      const ctx = makeCtx({ load, pagetype, fetchProduct })

      const result = await callProduct(
        [
          { key: 'id', value: '999' },
          { key: 'slug', value: 'blue-shirt-999' },
        ],
        ctx
      )

      expect(pagetype).toHaveBeenCalledWith('blue-shirt-999/p')
      expect(fetchProduct).toHaveBeenCalledWith({ field: 'id', value: '55' })
      expect(result.isVariantOf).toMatchObject({ productId: 'prod1' })
      expect(result.itemId).toBe('55')
    })

    it('falls back when the slug has no numeric skuId suffix and there is no id facet', async () => {
      const load = vi.fn()
      const pagetype = vi
        .fn()
        .mockResolvedValue({ pageType: 'Product', id: 55 })
      const fetchProduct = vi.fn().mockResolvedValue(makeSearchProduct())
      const ctx = makeCtx({ load, pagetype, fetchProduct })

      await callProduct([{ key: 'slug', value: 'blue-shirt' }], ctx)

      expect(load).not.toHaveBeenCalled()
      expect(pagetype).toHaveBeenCalledWith('blue-shirt/p')
    })

    it('rejects with BadRequestError when neither id nor slug is provided at all', async () => {
      const ctx = makeCtx()

      await expect(callProduct([], ctx)).rejects.toThrow('Missing slug or id')
    })

    it('throws NotFoundError when pagetype does not resolve to a product', async () => {
      const load = vi.fn().mockRejectedValue(new NotFoundError('no sku'))
      const pagetype = vi.fn().mockResolvedValue({ pageType: 'Search' })
      const ctx = makeCtx({ load, pagetype })

      await expect(
        callProduct(
          [
            { key: 'id', value: '999' },
            { key: 'slug', value: 'blue-shirt-999' },
          ],
          ctx
        )
      ).rejects.toThrow(/No product found for slug/)
    })

    it('throws NotFoundError when Intelligent Search has no product for the resolved id', async () => {
      const load = vi.fn().mockRejectedValue(new NotFoundError('no sku'))
      const pagetype = vi
        .fn()
        .mockResolvedValue({ pageType: 'Product', id: 55 })
      const fetchProduct = vi.fn().mockRejectedValue(new Error('IS down'))
      const ctx = makeCtx({ load, pagetype, fetchProduct })

      await expect(
        callProduct(
          [
            { key: 'id', value: '999' },
            { key: 'slug', value: 'blue-shirt-999' },
          ],
          ctx
        )
      ).rejects.toThrow(/No product found for id 55/)
    })

    it('rethrows unrelated errors without falling back', async () => {
      const load = vi.fn().mockRejectedValue(new Error('boom'))
      const pagetype = vi.fn()
      const ctx = makeCtx({ load, pagetype })

      await expect(
        callProduct([{ key: 'id', value: '999' }], ctx)
      ).rejects.toThrow('boom')
      expect(pagetype).not.toHaveBeenCalled()
    })
  })
})
