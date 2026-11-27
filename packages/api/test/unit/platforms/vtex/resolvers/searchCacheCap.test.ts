import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { NotFoundError } from '../../../../../src/platforms/errors'
import { Query } from '../../../../../src/platforms/vtex/resolvers/query'
import { StoreSearchResult } from '../../../../../src/platforms/vtex/resolvers/searchResult'

const now = Date.parse('2026-11-26T15:00:00.000Z')

const at = (seconds: number) => new Date(now + seconds * 1000).toISOString()

const apiRoot = resolve(
  dirname(fileURLToPath(import.meta.url)),
  '..',
  '..',
  '..',
  '..',
  '..'
)

const publicHint = () => ({
  sMaxAge: 300,
  staleWhileRevalidate: 3600,
  scope: 'public' as const,
})

const cappedHint = () => ({
  sMaxAge: 120,
  staleWhileRevalidate: 120,
  scope: 'public' as const,
})

const source = (relativePath: string) =>
  readFileSync(resolve(apiRoot, relativePath), 'utf8')

const commercialOffer = ({
  seconds,
  priceState,
  includePriceState = false,
  availableQuantity = 5,
  spotPrice = 10,
}: {
  seconds: number
  priceState?: unknown
  includePriceState?: boolean
  availableQuantity?: number
  spotPrice?: number
}) => ({
  PriceValidUntil: at(seconds),
  AvailableQuantity: availableQuantity,
  spotPrice,
  ...(includePriceState ? { priceState } : {}),
})

const productWithObject = (itemId = '100') => ({
  productId: 'prod1',
  description: '',
  linkText: 'blue-shirt',
  items: [
    {
      itemId,
      sellers: [
        {
          commertialOffer: commercialOffer({
            seconds: 120,
            includePriceState: true,
            priceState: {},
          }),
        },
      ],
    },
  ],
})

const productWithSibling = () => ({
  productId: 'prod1',
  description: '',
  linkText: 'blue-shirt',
  items: [
    {
      itemId: 'chosen',
      sellers: [
        {
          commertialOffer: commercialOffer({
            seconds: 7200,
            availableQuantity: 8,
            spotPrice: 20,
          }),
        },
      ],
    },
    {
      itemId: 'sibling',
      sellers: [
        {
          commertialOffer: commercialOffer({
            seconds: 120,
            includePriceState: true,
            priceState: { available: true, reasonKey: null },
            availableQuantity: 0,
            spotPrice: 1,
          }),
        },
      ],
    },
  ],
})

const searchPage = (products: unknown[]) => ({
  products,
  recordsFiltered: products.length,
  pagination: { after: [], before: [] },
  operator: 'and',
  fuzzy: '0',
  searchId: 'search-1',
})

const loadedSku = (items?: unknown) => ({
  itemId: '100',
  sellers: [],
  isVariantOf: {
    linkText: 'blue-shirt',
    productId: 'prod1',
    ...(items === undefined ? {} : { items }),
  },
})

const productContext = ({
  load = vi.fn(),
  pagetype = vi.fn(),
  fetchProduct = vi.fn(),
  cacheControl = publicHint(),
}: {
  load?: ReturnType<typeof vi.fn>
  pagetype?: ReturnType<typeof vi.fn>
  fetchProduct?: ReturnType<typeof vi.fn>
  cacheControl?: ReturnType<typeof publicHint>
} = {}) => ({
  headers: {},
  storage: { locale: 'en-US' },
  loaders: { skuLoader: { load } },
  clients: {
    catalog: { getLocalizedProduct: vi.fn() },
    commerce: { catalog: { portal: { pagetype } } },
    search: { fetchProduct },
  },
  cacheControl,
})

const searchContext = (
  search: Record<string, unknown>,
  cacheControl = publicHint()
) => ({
  headers: {},
  storage: { customSortMap: {}, locale: 'en-US' },
  clients: { search },
  cacheControl,
})

beforeEach(() => {
  vi.spyOn(Date, 'now').mockReturnValue(now)
})

afterEach(() => {
  vi.restoreAllMocks()
})

describe('search cache cap on resolvers', () => {
  it('lowers Query.product when isVariantOf.items carries the object', async () => {
    const sku = loadedSku(productWithObject().items)
    const ctx = productContext({ load: vi.fn().mockResolvedValue(sku) })

    const result = await Query.product(
      null,
      { locator: [{ key: 'id', value: '100' }] },
      ctx as any
    )

    expect(result).toBe(sku)
    expect(ctx.cacheControl).toEqual(cappedHint())
  })

  it('keeps 300 and 3600 on Query.product when the object is absent', async () => {
    const sku = loadedSku([
      {
        sellers: [{ commertialOffer: commercialOffer({ seconds: 120 }) }],
      },
    ])
    const ctx = productContext({ load: vi.fn().mockResolvedValue(sku) })

    await Query.product(
      null,
      { locator: [{ key: 'id', value: '100' }] },
      ctx as any
    )

    expect(ctx.cacheControl).toEqual(publicHint())
  })

  it('does not throw when Query.product has no items list', async () => {
    const sku = loadedSku()
    const ctx = productContext({ load: vi.fn().mockResolvedValue(sku) })

    await expect(
      Query.product(
        null,
        { locator: [{ key: 'id', value: '100' }] },
        ctx as any
      )
    ).resolves.toBe(sku)
    expect(ctx.cacheControl).toEqual(publicHint())
  })

  it('lowers the hint when the slug fallback returns a product with the object', async () => {
    const fetchProduct = vi.fn().mockResolvedValue(productWithObject('55'))
    const ctx = productContext({
      load: vi.fn().mockRejectedValue(new NotFoundError('no sku')),
      pagetype: vi.fn().mockResolvedValue({ pageType: 'Product', id: 55 }),
      fetchProduct,
    })

    const result = await Query.product(
      null,
      {
        locator: [
          { key: 'id', value: '999' },
          { key: 'slug', value: 'blue-shirt-999' },
        ],
      },
      ctx as any
    )

    expect(fetchProduct).toHaveBeenCalledWith({ field: 'id', value: '55' })
    expect(result.itemId).toBe('55')
    expect(ctx.cacheControl).toEqual(cappedHint())
  })

  it('lowers the hint for allProducts and products', async () => {
    const allCtx = searchContext({
      products: vi
        .fn()
        .mockResolvedValue(searchPage([productWithObject('55')])),
    })
    const selectedCtx = searchContext({
      productsByIdentifier: vi
        .fn()
        .mockResolvedValue([productWithObject('55')]),
    })

    await Query.allProducts(null, { first: 8 }, allCtx as any)
    await Query.products(null, { productIds: ['55'] }, selectedCtx as any)

    expect(allCtx.cacheControl).toEqual(cappedHint())
    expect(selectedCtx.cacheControl).toEqual(cappedHint())
  })

  it('caps StoreSearchResult.products from the sibling item pickBestSku skipped', async () => {
    const ctx = searchContext({})
    const root = {
      searchArgs: { query: 'shirt' },
      productSearchPromise: Promise.resolve(searchPage([productWithSibling()])),
    }

    const result = await StoreSearchResult.products(root as any, {}, ctx as any)

    expect(result.edges[0].node.itemId).toBe('chosen')
    expect(ctx.cacheControl).toEqual(cappedHint())
  })

  it('lowers suggestions when the query branch reads products', async () => {
    const ctx = searchContext({
      suggestedTerms: vi.fn().mockResolvedValue({ searches: [] }),
    })
    const root = {
      searchArgs: { query: 'shirt' },
      productSearchPromise: Promise.resolve(searchPage([productWithSibling()])),
    }

    const result = await StoreSearchResult.suggestions(
      root as any,
      {},
      ctx as any
    )

    expect(result.products[0].itemId).toBe('chosen')
    expect(ctx.cacheControl).toEqual(cappedHint())
  })

  it('keeps the hint for suggestions that only return top searches', async () => {
    const topSearches = vi
      .fn()
      .mockResolvedValue({ searches: [{ term: 'shirt', count: 3 }] })
    const ctx = searchContext({ topSearches })
    const root = {
      searchArgs: {},
      productSearchPromise: Promise.resolve(searchPage([productWithSibling()])),
    }

    const result = await StoreSearchResult.suggestions(
      root as any,
      {},
      ctx as any
    )

    expect(topSearches).toHaveBeenCalled()
    expect(result.products).toEqual([])
    expect(ctx.cacheControl).toEqual(publicHint())
  })

  it('keeps the hint for Query.search, facets, metadata, and searchId', async () => {
    const ctx = searchContext({
      products: vi.fn().mockResolvedValue(searchPage([productWithSibling()])),
      facets: vi.fn().mockResolvedValue({ facets: [] }),
    })

    const root = await Query.search(
      null,
      { first: 8, term: 'shirt' },
      ctx as any
    )
    await root.productSearchPromise
    await StoreSearchResult.metadata(root, {}, ctx as any)
    await StoreSearchResult.facets(root, {}, ctx as any)
    await StoreSearchResult.searchId(root, {}, ctx as any)

    expect(ctx.cacheControl).toEqual(publicHint())
  })

  it('leaves the same pair after products and suggestions read one response', async () => {
    const ctx = searchContext({
      suggestedTerms: vi.fn().mockResolvedValue({ searches: [] }),
    })
    const root = {
      searchArgs: { query: 'shirt' },
      productSearchPromise: Promise.resolve(searchPage([productWithSibling()])),
    }

    await StoreSearchResult.products(root as any, {}, ctx as any)
    await StoreSearchResult.suggestions(root as any, {}, ctx as any)

    expect(ctx.cacheControl.sMaxAge).toBe(ctx.cacheControl.staleWhileRevalidate)
    expect(ctx.cacheControl).toEqual(cappedHint())
  })

  it('does not cap the cart loader, validateCart, or the search client', () => {
    for (const path of [
      'src/platforms/vtex/loaders/sku.ts',
      'src/platforms/vtex/resolvers/validateCart.ts',
      'src/platforms/vtex/clients/search/index.ts',
    ]) {
      expect(source(path)).not.toContain('applySearchCacheCap')
    }

    const client = source('src/platforms/vtex/clients/search/index.ts')

    expect(client).not.toContain('Cache-Control')
    expect(client).not.toContain('s-maxage')
    expect(source('src/platforms/vtex/typeDefs/offer.graphql')).toContain(
      'reasonKey: String'
    )
  })
})
