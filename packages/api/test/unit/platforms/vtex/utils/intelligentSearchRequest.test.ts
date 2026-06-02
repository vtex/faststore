import {
  buildIntelligentSearchRequest,
  type IntelligentSearchFacet,
} from '../../../../../src/platforms/vtex/utils/intelligentSearchRequest'

const baseDefaults = {
  locale: 'pt-BR',
  salesChannel: 1,
  regionId: 'region-abc',
  hideUnavailableItems: true,
  simulationBehavior: 'default' as const,
  showSponsored: false,
}

function paramsToObject(params: URLSearchParams): Record<string, string> {
  return Object.fromEntries(params.entries())
}

describe('buildIntelligentSearchRequest', () => {
  describe('product-search pagination and query', () => {
    it('derives from/to from page and count', () => {
      const request = buildIntelligentSearchRequest({
        endpoint: 'product-search',
        defaults: baseDefaults,
        args: { page: 2, count: 12, query: 'shoes' },
      })

      expect(paramsToObject(request.params)).toMatchObject({
        from: '24',
        to: '35',
        query: 'shoes',
        locale: 'pt-BR',
        sc: '1',
        regionId: 'region-abc',
        hideUnavailableItems: 'true',
        simulationBehavior: 'default',
        showSponsored: 'false',
      })
    })

    it('omits query and sort when not provided', () => {
      const request = buildIntelligentSearchRequest({
        endpoint: 'product-search',
        defaults: baseDefaults,
        args: { page: 0, count: 10 },
      })

      const params = paramsToObject(request.params)

      expect(params.query).toBeUndefined()
      expect(params.sort).toBeUndefined()
      expect(params.from).toBe('0')
      expect(params.to).toBe('9')
    })

    it('includes sort when provided', () => {
      const request = buildIntelligentSearchRequest({
        endpoint: 'product-search',
        defaults: baseDefaults,
        args: { page: 0, count: 10, sort: 'price:desc' },
      })

      expect(paramsToObject(request.params).sort).toBe('price:desc')
    })

    it('handles count=0 pagination edge case', () => {
      const request = buildIntelligentSearchRequest({
        endpoint: 'product-search',
        defaults: baseDefaults,
        args: { page: 3, count: 0 },
      })

      expect(paramsToObject(request.params)).toMatchObject({
        from: '0',
        to: '0',
      })
    })
  })

  describe('segment parsing and defaults fallbacks', () => {
    it('extracts shipping keys from segment facets into query params', () => {
      const request = buildIntelligentSearchRequest({
        endpoint: 'product-search',
        segment: {
          channel: 2,
          regionId: 'seg-region',
          cultureInfo: 'en-US',
          countryCode: 'USA',
          facets: 'zip-code=12345;coordinates=-46,-23;department=electronics',
        },
        defaults: { locale: 'en-US' },
        args: { page: 0, count: 10 },
      })

      expect(paramsToObject(request.params)).toMatchObject({
        sc: '2',
        regionId: 'seg-region',
        locale: 'en-US',
        'zip-code': '12345',
        coordinates: '-46,-23',
      })
      expect(request.path).toContain('department/electronics/')
    })

    it('falls back to defaults for sc and regionId when absent in segment', () => {
      const request = buildIntelligentSearchRequest({
        endpoint: 'facets',
        segment: {},
        defaults: {
          locale: 'pt-BR',
          salesChannel: 3,
          regionId: 'fallback-region',
          hideUnavailableItems: false,
        },
        args: { page: 0, count: 5 },
      })

      expect(paramsToObject(request.params)).toMatchObject({
        sc: '3',
        regionId: 'fallback-region',
        locale: 'pt-BR',
        hideUnavailableItems: 'false',
      })
    })

    it('prefers segment sc/regionId over defaults', () => {
      const request = buildIntelligentSearchRequest({
        endpoint: 'facets',
        segment: { channel: 9, regionId: 'from-segment' },
        defaults: {
          locale: 'pt-BR',
          salesChannel: 1,
          regionId: 'from-defaults',
        },
        args: { page: 0, count: 5 },
      })

      expect(paramsToObject(request.params)).toMatchObject({
        sc: '9',
        regionId: 'from-segment',
      })
    })
  })

  describe('facet handling', () => {
    it('puts fuzzy, operator, and pickupPoint in query params', () => {
      const selectedFacets: IntelligentSearchFacet[] = [
        { key: 'fuzzy', value: 'auto' },
        { key: 'operator', value: 'and' },
        { key: 'pickupPoint', value: 'store-123' },
        { key: 'brand', value: 'nike' },
      ]

      const request = buildIntelligentSearchRequest({
        endpoint: 'product-search',
        defaults: baseDefaults,
        args: { page: 0, count: 10, selectedFacets },
      })

      expect(paramsToObject(request.params)).toMatchObject({
        fuzzy: 'auto',
        operator: 'and',
        pickupPoint: 'store-123',
      })
      expect(request.path).toContain('brand/nike/')
      expect(request.path).not.toContain('fuzzy/')
    })

    it('excludes trade-policy and region-id from path', () => {
      const selectedFacets: IntelligentSearchFacet[] = [
        { key: 'trade-policy', value: '1' },
        { key: 'region-id', value: 'abc' },
        { key: 'category-1', value: 'shoes' },
      ]

      const request = buildIntelligentSearchRequest({
        endpoint: 'product-search',
        defaults: baseDefaults,
        args: { page: 0, count: 10, selectedFacets },
      })

      expect(request.path).toBe('category-1/shoes/')
      expect(request.path).not.toContain('trade-policy')
      expect(request.path).not.toContain('region-id')
    })

    it('includes shipping facet in path when not all-delivery-methods', () => {
      const request = buildIntelligentSearchRequest({
        endpoint: 'product-search',
        defaults: baseDefaults,
        args: {
          page: 0,
          count: 10,
          selectedFacets: [{ key: 'shipping', value: 'delivery' }],
        },
      })

      expect(request.path).toContain('shipping/delivery/')
    })

    it('keeps all-delivery-methods in path from selectedFacets but does not re-add shipping', () => {
      const request = buildIntelligentSearchRequest({
        endpoint: 'product-search',
        defaults: baseDefaults,
        args: {
          page: 0,
          count: 10,
          selectedFacets: [
            { key: 'shipping', value: 'all-delivery-methods' },
            { key: 'brand', value: 'adidas' },
          ],
        },
      })

      expect(request.path).toBe('shipping/all-delivery-methods/brand/adidas/')
    })

    it('uses in-stock facet to override hideUnavailableItems', () => {
      const request = buildIntelligentSearchRequest({
        endpoint: 'product-search',
        defaults: { ...baseDefaults, hideUnavailableItems: true },
        args: {
          page: 0,
          count: 10,
          selectedFacets: [{ key: 'in-stock', value: 'false' }],
        },
      })

      expect(paramsToObject(request.params).hideUnavailableItems).toBe('false')
    })

    it('normalizes pickup-in-point shipping facet and merges pickupPoint query param', () => {
      const request = buildIntelligentSearchRequest({
        endpoint: 'product-search',
        segment: {
          facets: 'pickupPoint=segment-store',
        },
        defaults: baseDefaults,
        args: {
          page: 0,
          count: 10,
          selectedFacets: [
            { key: 'shipping', value: 'pickup-in-point-my-store-id' },
          ],
        },
      })

      expect(request.path).toContain('shipping/pickup-in-point/')
      expect(paramsToObject(request.params).pickupPoint).toBe('my-store-id')
    })
  })

  describe('catalog-count endpoint', () => {
    it('omits from, to, and sort', () => {
      const request = buildIntelligentSearchRequest({
        endpoint: 'catalog-count',
        defaults: baseDefaults,
        args: {
          page: 1,
          count: 20,
          sort: 'price:asc',
          query: 'jacket',
          selectedFacets: [{ key: 'brand', value: 'puma' }],
        },
      })

      const params = paramsToObject(request.params)

      expect(params.from).toBeUndefined()
      expect(params.to).toBeUndefined()
      expect(params.sort).toBeUndefined()
      expect(params.query).toBe('jacket')
      expect(request.path).toBe('brand/puma/')
    })
  })

  describe('products endpoint', () => {
    it('builds field, value, and segment params', () => {
      const request = buildIntelligentSearchRequest({
        endpoint: 'products',
        segment: { channel: 1, cultureInfo: 'pt-BR' },
        defaults: { locale: 'pt-BR', salesChannel: 1 },
        args: {
          field: 'slug',
          value: 'my-product',
          hideUnavailableItems: true,
          showInvisibleItems: true,
        },
      })

      expect(request.path).toBe('')
      expect(paramsToObject(request.params)).toMatchObject({
        field: 'slug',
        value: 'my-product',
        sc: '1',
        locale: 'pt-BR',
        hideUnavailableItems: 'true',
        'show-invisible-items': 'true',
      })
    })
  })

  describe('search-suggestions and top-searches endpoints', () => {
    it('builds search-suggestions with query and locale', () => {
      const request = buildIntelligentSearchRequest({
        endpoint: 'search-suggestions',
        defaults: { locale: 'es-AR' },
        args: { query: 'camisa' },
      })

      expect(request.path).toBe('')
      expect(paramsToObject(request.params)).toEqual({
        query: 'camisa',
        locale: 'es-AR',
      })
      expect(request.toString()).toBe('?query=camisa&locale=es-AR')
    })

    it('builds top-searches with locale only', () => {
      const request = buildIntelligentSearchRequest({
        endpoint: 'top-searches',
        defaults: { locale: 'pt-BR' },
      })

      expect(request.path).toBe('')
      expect(paramsToObject(request.params)).toEqual({ locale: 'pt-BR' })
      expect(request.toString()).toBe('?locale=pt-BR')
    })
  })

  describe('optional search params', () => {
    it('includes sponsoredCount and allowRedirect when provided', () => {
      const request = buildIntelligentSearchRequest({
        endpoint: 'product-search',
        defaults: { ...baseDefaults, showSponsored: true },
        args: {
          page: 0,
          count: 10,
          sponsoredCount: 5,
          allowRedirect: true,
          showInvisibleItems: true,
        },
      })

      expect(paramsToObject(request.params)).toMatchObject({
        sponsoredCount: '5',
        allowRedirect: 'true',
        showSponsored: 'true',
        'show-invisible-items': 'true',
      })
    })
  })

  describe('toString', () => {
    it('returns path and query for search-like endpoints', () => {
      const request = buildIntelligentSearchRequest({
        endpoint: 'product-search',
        defaults: baseDefaults,
        args: {
          page: 0,
          count: 10,
          selectedFacets: [{ key: 'brand', value: 'nike' }],
        },
      })

      expect(request.toString()).toMatch(/^brand\/nike\/\?/)
      expect(request.toString()).toContain('from=0')
      expect(request.toString()).toContain('to=9')
    })
  })
})
