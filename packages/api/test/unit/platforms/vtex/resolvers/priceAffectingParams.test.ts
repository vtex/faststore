import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it, vi } from 'vitest'

import { NotFoundError } from '../../../../../src/platforms/errors'
import { StoreOffer } from '../../../../../src/platforms/vtex/resolvers/offer'
import { Query } from '../../../../../src/platforms/vtex/resolvers/query'
import { StoreSearchResult } from '../../../../../src/platforms/vtex/resolvers/searchResult'
import { stampPriceAffectingParams } from '../../../../../src/platforms/vtex/utils/priceAffectingParams'

const text = '{"b":1,"a":2}'
const now = Date.parse('2026-11-27T15:00:00.000Z')

const at = (seconds: number) => new Date(now + seconds * 1000).toISOString()

const apiRoot = resolve(
  dirname(fileURLToPath(import.meta.url)),
  '..',
  '..',
  '..',
  '..',
  '..'
)

const source = (relativePath: string) =>
  readFileSync(resolve(apiRoot, relativePath), 'utf8')

const publicHint = () => ({
  sMaxAge: 300,
  staleWhileRevalidate: 3600,
  scope: 'public' as const,
})

const priceStateOf = (root: object) =>
  StoreOffer.priceState(root as never) as {
    available: boolean
    reasonKey: string | null
    priceAffectingParams: string | null
  }

const offerFromSku = (sku: object) => ({
  Price: 10,
  seller: { sellerId: '1' },
  product: sku,
  commertialOffer: { priceState: {} },
})

const catalogProduct = (itemId: string, includePriceState = false) => ({
  productId: `prod-${itemId}`,
  description: '',
  linkText: 'blue-shirt',
  items: [
    {
      itemId,
      sellers: [
        {
          sellerId: '1',
          commertialOffer: {
            AvailableQuantity: 5,
            spotPrice: 10,
            PriceValidUntil: at(120),
            ...(includePriceState ? { priceState: {} } : {}),
          },
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

const productContext = ({
  load = vi.fn(),
  productsByIdentifier = vi.fn(),
  fetchProduct = vi.fn(),
  pagetype = vi.fn(),
  cacheControl = publicHint(),
  enableUnavailableItemsOnCart = false,
}: {
  load?: ReturnType<typeof vi.fn>
  productsByIdentifier?: ReturnType<typeof vi.fn>
  fetchProduct?: ReturnType<typeof vi.fn>
  pagetype?: ReturnType<typeof vi.fn>
  cacheControl?: ReturnType<typeof publicHint>
  enableUnavailableItemsOnCart?: boolean
} = {}) => ({
  headers: {},
  storage: {
    locale: 'en-US',
    flags: { enableUnavailableItemsOnCart },
  },
  loaders: { skuLoader: { load } },
  clients: {
    catalog: { getLocalizedProduct: vi.fn() },
    commerce: { catalog: { portal: { pagetype } } },
    search: { productsByIdentifier, fetchProduct },
  },
  cacheControl,
})

const searchContext = (
  search: Record<string, ReturnType<typeof vi.fn>>,
  cacheControl = publicHint()
) => ({
  headers: {},
  storage: { customSortMap: {}, locale: 'en-US', flags: {} },
  clients: { search },
  cacheControl,
})

describe('StoreOffer.priceState', () => {
  it('returns the stamped string on a sku and on a cart line', () => {
    const sku = stampPriceAffectingParams({ itemId: '100' }, text)
    const line = stampPriceAffectingParams(
      { skuName: 'Shirt', commertialOffer: { priceState: {} } },
      text
    )

    expect(priceStateOf(offerFromSku(sku))).toEqual({
      available: true,
      reasonKey: null,
      priceAffectingParams: text,
    })
    expect(priceStateOf(line)).toEqual({
      available: true,
      reasonKey: null,
      priceAffectingParams: text,
    })
  })

  it('echoes an unavailable priceState from the offer and from the cart line', () => {
    const unavailable = {
      available: false,
      reasonKey: 'PRICE_REQUIRES_LOGIN',
    }

    expect(
      priceStateOf({
        Price: 10,
        seller: { sellerId: '1' },
        product: { itemId: '100' },
        priceState: unavailable,
      })
    ).toEqual({
      available: false,
      reasonKey: 'PRICE_REQUIRES_LOGIN',
      priceAffectingParams: null,
    })
    expect(
      priceStateOf({
        skuName: 'Shirt',
        priceState: { available: false },
      })
    ).toEqual({
      available: false,
      reasonKey: null,
      priceAffectingParams: null,
    })
  })

  it('returns null without a stamp even when commertialOffer.priceState is an object', () => {
    expect(
      priceStateOf(offerFromSku({ itemId: '100' })).priceAffectingParams
    ).toBeNull()
    expect(
      priceStateOf({
        skuName: 'Shirt',
        commertialOffer: { priceState: {} },
      }).priceAffectingParams
    ).toBeNull()
  })
})

describe('Query.product priceAffectingParams', () => {
  it('calls productsByIdentifier with the text and skips skuLoader', async () => {
    vi.spyOn(Date, 'now').mockReturnValue(now)
    const load = vi.fn()
    const productsByIdentifier = vi
      .fn()
      .mockResolvedValue([catalogProduct('100')])
    const ctx = productContext({
      load,
      productsByIdentifier,
      enableUnavailableItemsOnCart: true,
    })

    const result = await Query.product(
      null,
      { locator: [{ key: 'id', value: '100' }], priceAffectingParams: text },
      ctx as never
    )

    expect(load).not.toHaveBeenCalled()
    expect(productsByIdentifier).toHaveBeenCalledWith({
      field: 'sku',
      values: ['100'],
      throwOnUpstreamError: true,
      priceAffectingParams: text,
      hideUnavailableItems: false,
    })
    expect(priceStateOf(offerFromSku(result)).priceAffectingParams).toBe(text)
    expect(ctx.cacheControl).toEqual(publicHint())
    vi.restoreAllMocks()
  })

  it('falls back to fetchProduct with the text when the sku is missing', async () => {
    const load = vi.fn()
    const productsByIdentifier = vi.fn().mockResolvedValue([])
    const fetchProduct = vi.fn().mockResolvedValue(catalogProduct('55'))
    const pagetype = vi.fn().mockResolvedValue({ pageType: 'Product', id: 55 })
    const ctx = productContext({
      load,
      productsByIdentifier,
      fetchProduct,
      pagetype,
    })

    const result = await Query.product(
      null,
      {
        locator: [
          { key: 'id', value: '999' },
          { key: 'slug', value: 'blue-shirt-999' },
        ],
        priceAffectingParams: text,
      },
      ctx as never
    )

    expect(load).not.toHaveBeenCalled()
    expect(productsByIdentifier).toHaveBeenCalledWith({
      field: 'sku',
      values: ['999'],
      throwOnUpstreamError: true,
      priceAffectingParams: text,
    })
    expect(fetchProduct).toHaveBeenCalledWith({
      field: 'id',
      value: '55',
      priceAffectingParams: text,
    })
    expect(result.itemId).toBe('55')
    expect(priceStateOf(offerFromSku(result)).priceAffectingParams).toBe(text)
  })

  it('keeps skuLoader and omits the field on the slug fallback without a string', async () => {
    const sku = {
      itemId: '100',
      sellers: [],
      isVariantOf: { linkText: 'blue-shirt', productId: 'prod1', items: [] },
    }
    const load = vi.fn().mockResolvedValue(sku)
    const productsByIdentifier = vi.fn()
    const direct = productContext({ load, productsByIdentifier })

    const directResult = await Query.product(
      null,
      { locator: [{ key: 'id', value: '100' }] },
      direct as never
    )

    expect(load).toHaveBeenCalledWith('100')
    expect(productsByIdentifier).not.toHaveBeenCalled()
    expect(directResult).toBe(sku)

    const fallbackLoad = vi.fn().mockRejectedValue(new NotFoundError('no sku'))
    const fetchProduct = vi.fn().mockResolvedValue(catalogProduct('55'))
    const fallback = productContext({
      load: fallbackLoad,
      productsByIdentifier,
      fetchProduct,
      pagetype: vi.fn().mockResolvedValue({ pageType: 'Product', id: 55 }),
    })

    const fallbackResult = await Query.product(
      null,
      {
        locator: [
          { key: 'id', value: '999' },
          { key: 'slug', value: 'blue-shirt-999' },
        ],
      },
      fallback as never
    )

    expect(fallbackLoad).toHaveBeenCalled()
    expect(fetchProduct).toHaveBeenCalledWith({ field: 'id', value: '55' })
    expect(
      priceStateOf(offerFromSku(fallbackResult)).priceAffectingParams
    ).toBe(null)
  })

  it('still lowers the hint from a raw priceState object when no string follows', async () => {
    vi.spyOn(Date, 'now').mockReturnValue(now)
    const sku = {
      itemId: '100',
      sellers: [],
      isVariantOf: {
        linkText: 'blue-shirt',
        productId: 'prod1',
        items: catalogProduct('100', true).items,
      },
    }
    const ctx = productContext({ load: vi.fn().mockResolvedValue(sku) })

    await Query.product(
      null,
      { locator: [{ key: 'id', value: '100' }] },
      ctx as never
    )

    expect(ctx.cacheControl).toEqual({
      sMaxAge: 120,
      staleWhileRevalidate: 120,
      scope: 'public',
    })
    vi.restoreAllMocks()
  })
})

describe('Query.search priceAffectingParams', () => {
  it('passes the text to products and keeps it off searchArgs for facets', async () => {
    const products = vi.fn().mockResolvedValue(searchPage([]))
    const facets = vi.fn().mockResolvedValue({ facets: [] })
    const ctx = searchContext({ products, facets })

    const root = await Query.search(
      null,
      { first: 8, term: 'shirt', priceAffectingParams: text },
      ctx as never
    )
    await StoreSearchResult.facets(root, {}, ctx as never)

    expect(products).toHaveBeenCalledWith(
      expect.objectContaining({ priceAffectingParams: text, query: 'shirt' })
    )
    expect(facets.mock.calls[0][0]).not.toHaveProperty('priceAffectingParams')
    expect(root.searchArgs).not.toHaveProperty('priceAffectingParams')
  })

  it('passes the text to productsByIdentifier on cross-selling', async () => {
    const productsByIdentifier = vi.fn().mockResolvedValue([])
    const products = vi.fn()
    const crossselling = vi.fn().mockResolvedValue([{ productId: '20' }])
    const ctx = {
      headers: {},
      storage: { customSortMap: {}, locale: 'en-US', flags: {} },
      clients: {
        search: { productsByIdentifier, products },
        commerce: { catalog: { products: { crossselling } } },
      },
    }

    await Query.search(
      null,
      {
        first: 8,
        selectedFacets: [{ key: 'similars', value: '10' }],
        priceAffectingParams: text,
      },
      ctx as never
    )

    expect(products).not.toHaveBeenCalled()
    expect(productsByIdentifier).toHaveBeenCalledWith({
      field: 'id',
      values: ['20'],
      priceAffectingParams: text,
    })
  })

  it('echoes the string on each suggestion and product offer, and null without it', async () => {
    const page = searchPage([catalogProduct('100'), catalogProduct('200')])
    const withText = searchContext({
      products: vi.fn().mockResolvedValue(page),
      suggestedTerms: vi.fn().mockResolvedValue({ searches: [] }),
    })
    const echoed = await Query.search(
      null,
      { first: 8, term: 'shirt', priceAffectingParams: text },
      withText as never
    )
    const connection = await StoreSearchResult.products(
      echoed,
      {},
      withText as never
    )
    const suggestions = await StoreSearchResult.suggestions(
      echoed,
      {},
      withText as never
    )

    expect(connection.edges).toHaveLength(2)
    expect(suggestions.products).toHaveLength(2)

    for (const edge of connection.edges) {
      expect(priceStateOf(offerFromSku(edge.node)).priceAffectingParams).toBe(
        text
      )
    }

    for (const sku of suggestions.products) {
      expect(priceStateOf(offerFromSku(sku)).priceAffectingParams).toBe(text)
    }

    const withoutText = searchContext({
      products: vi.fn().mockResolvedValue(page),
      suggestedTerms: vi.fn().mockResolvedValue({ searches: [] }),
    })
    const plain = await Query.search(
      null,
      { first: 8, term: 'shirt' },
      withoutText as never
    )
    const plainConnection = await StoreSearchResult.products(
      plain,
      {},
      withoutText as never
    )
    const plainSuggestions = await StoreSearchResult.suggestions(
      plain,
      {},
      withoutText as never
    )

    for (const edge of plainConnection.edges) {
      expect(priceStateOf(offerFromSku(edge.node)).priceAffectingParams).toBe(
        null
      )
    }

    for (const sku of plainSuggestions.products) {
      expect(priceStateOf(offerFromSku(sku)).priceAffectingParams).toBeNull()
    }
  })
})

describe('queries that do not take the string', () => {
  it('calls allProducts and products search without the field and does not stamp', async () => {
    const products = vi
      .fn()
      .mockResolvedValue(searchPage([catalogProduct('55')]))
    const productsByIdentifier = vi
      .fn()
      .mockResolvedValue([catalogProduct('55')])
    const allCtx = searchContext({ products })
    const selectedCtx = searchContext({ productsByIdentifier })

    const all = await Query.allProducts(
      null,
      { first: 8, priceAffectingParams: text } as never,
      allCtx as never
    )
    const selected = await Query.products(
      null,
      { productIds: ['55'], priceAffectingParams: text } as never,
      selectedCtx as never
    )

    expect(products).toHaveBeenCalledWith({ page: 0, count: 8 })
    expect(productsByIdentifier).toHaveBeenCalledWith({
      field: 'id',
      values: ['55'],
    })
    expect(
      priceStateOf(offerFromSku(all.edges[0].node)).priceAffectingParams
    ).toBe(null)
    expect(priceStateOf(offerFromSku(selected[0])).priceAffectingParams).toBe(
      null
    )
  })
})

describe('sku loader source', () => {
  it('does not mention priceAffectingParams', () => {
    expect(source('src/platforms/vtex/loaders/sku.ts')).not.toContain(
      'priceAffectingParams'
    )
  })
})

const repoSource = (relativePath: string) =>
  readFileSync(resolve(apiRoot, '../..', relativePath), 'utf8')

describe('native documents stay without the string', () => {
  it('keeps validateCart uncached and reasonKey a string', () => {
    const mutation = source('src/platforms/vtex/typeDefs/mutation.graphql')
    const validateCartField = mutation.slice(
      mutation.indexOf('validateCart('),
      mutation.indexOf('validateSession')
    )
    const validateCart = source('src/platforms/vtex/resolvers/validateCart.ts')
    const etagStart = validateCart.indexOf('const setOrderFormEtag')
    const etag = validateCart.slice(
      etagStart,
      validateCart.indexOf('const isOrderFormStale')
    )
    const offer = source('src/platforms/vtex/typeDefs/offer.graphql')

    expect(validateCartField).not.toContain('@cacheControl')
    expect(validateCart).not.toContain('cacheControl')
    expect(etag).toContain("key: 'cartEtag'")
    expect(etag).toContain("appId: 'faststore'")
    expect(offer).toContain('reasonKey: String')
    expect(offer).not.toContain('priceVariations')
  })

  it('keeps useOffer, the cart mutation cache list, and native queries free of the string', () => {
    const fetcher = repoSource('packages/core/src/sdk/offer/fetcher.ts')

    expect(fetcher).toContain('product_search')
    expect(fetcher).toContain('sku.id')
    expect(fetcher).not.toContain('priceAffectingParams')
    expect(
      repoSource('packages/core/@generated/cached-operations.json')
    ).not.toContain('ValidateCartMutation')

    for (const path of [
      'packages/core/src/sdk/product/useProductQuery.ts',
      'packages/core/src/pages/[slug]/p.tsx',
      'packages/core/src/sdk/product/useAllVariantProducts.ts',
      'packages/core/src/customizations/src/fragments/ClientProduct.ts',
      'packages/core/src/customizations/src/fragments/ServerProduct.ts',
      'packages/core/src/sdk/product/useProductGalleryQuery.ts',
      'packages/core/src/utils/fetchProductGallerySSR.ts',
      'packages/core/src/sdk/product/useProductsQuery.ts',
      'packages/core/src/sdk/product/useProductsPrefetch.ts',
      'packages/core/src/sdk/product/usePageProductsQuery.ts',
      'packages/core/src/sdk/search/useSuggestions.ts',
      'packages/core/src/sdk/search/useTopSearch.ts',
      'packages/core/src/customizations/src/fragments/ClientProductGallery.ts',
      'packages/core/src/customizations/src/fragments/ClientManyProducts.ts',
      'packages/core/src/customizations/src/fragments/ClientSearchSuggestions.ts',
      'packages/core/src/customizations/src/fragments/ClientTopSearchSuggestions.ts',
      'packages/core/src/sdk/product/useProductsSelected.tsx',
      'packages/core/src/sdk/product/index.ts',
      'packages/core/src/sdk/cart/index.ts',
    ]) {
      expect(repoSource(path), path).not.toContain('priceAffectingParams')
    }
  })
})
