import { describe, expect, it } from 'vitest'
import {
  buildIntelligentSearchRequest,
  parseSegmentCookie,
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

    it('prefers default sc/regionId over segment values', () => {
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
        sc: '1',
        regionId: 'from-defaults',
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

      expect(request.path).toBe('shipping/delivery/')
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

  describe('real vtex_segment cookie examples', () => {
    // '{"campaigns":null,"channel":"1",...,"facets":"zip-code=01002020;country=BRA;..."}'
    const segmentWithShippingBase64 =
      'eyJjYW1wYWlnbnMiOm51bGwsImNoYW5uZWwiOiIxIiwicHJpY2VUYWJsZXMiOm51bGwsInJlZ2lvbklkIjpudWxsLCJ1dG1fY2FtcGFpZ24iOm51bGwsInV0bV9zb3VyY2UiOm51bGwsInV0bWlfY2FtcGFpZ24iOm51bGwsImN1cnJlbmN5Q29kZSI6IkJSTCIsImN1cnJlbmN5U3ltYm9sIjoiUiQiLCJjb3VudHJ5Q29kZSI6IkJSQSIsImN1bHR1cmVJbmZvIjoicHQtQlIiLCJhZG1pbl9jdWx0dXJlSW5mbyI6InB0LUJSIiwiY2hhbm5lbFByaXZhY3kiOiJwdWJsaWMiLCJmYWNldHMiOiJ6aXAtY29kZT0wMTAwMjAyMDtjb3VudHJ5PUJSQTtjb29yZGluYXRlcz0tNDYuNjM3MDQ2ODEzOTY0ODUsLTIzLjU0NzIwNDk3MTMxMzQ3NztwaWNrdXBQb2ludD1tdW5kb2RvY2FiZWxlaXJlaXJvbG9qYTU1XzI5O2RlbGl2ZXJ5Wm9uZXNIYXNoPTk3NTMzMTg0MjZjMTNjMTkwMGI1ZmU1N2I2Mzk4MjdlO3BpY2t1cFBvaW50c0hhc2g9ODQzNWIzMjI1Mjg0ZDRlNTdjNjNjZjgxNjA4NzA5NGQ7In0='

    // '{"campaigns":null,"channel":"1",...,"facets":"productClusterIds=158;"}'
    const segmentWithProductClusterBase64 =
      'eyJjYW1wYWlnbnMiOm51bGwsImNoYW5uZWwiOiIxIiwicHJpY2VUYWJsZXMiOm51bGwsInJlZ2lvbklkIjoidjIuN0RDQjdDRDUzMzk5MzU2MkEyRkM0RUFGRUM2QjNEQjQiLCJ1dG1fY2FtcGFpZ24iOm51bGwsInV0bV9zb3VyY2UiOm51bGwsInV0bWlfY2FtcGFpZ24iOm51bGwsImN1cnJlbmN5Q29kZSI6IlVTRCIsImN1cnJlbmN5U3ltYm9sIjoiJCIsImNvdW50cnlDb2RlIjoiVVNBIiwiY3VsdHVyZUluZm8iOiJlbi1VUyIsImFkbWluX2N1bHR1cmVJbmZvIjoiZW4tVVMiLCJjaGFubmVsUHJpdmFjeSI6InB1YmxpYyIsImZhY2V0cyI6InByb2R1Y3RDbHVzdGVySWRzPTE1ODsifQ=='

    function cookieHeader(segmentBase64: string) {
      return `vtex_segment=${segmentBase64}`
    }

    it('returns empty object when cookie header is missing', () => {
      expect(parseSegmentCookie(undefined)).toEqual({})
    })

    it('returns empty object for malformed base64/json cookie', () => {
      expect(parseSegmentCookie('vtex_segment=not-base64')).toEqual({})
    })

    it('decodes shipping/geo segment from base64 cookie', () => {
      const segment = parseSegmentCookie(
        cookieHeader(segmentWithShippingBase64)
      )

      expect(segment.channel).toBe('1')
      expect(segment.regionId).toBeNull()
      expect(segment.countryCode).toBe('BRA')
      expect(segment.cultureInfo).toBe('pt-BR')
      expect(segment.facets).toBe(
        'zip-code=01002020;country=BRA;coordinates=-46.63704681396485,-23.547204971313477;pickupPoint=mundodocabeleireiroloja55_29;deliveryZonesHash=9753318426c13c1900b5fe57b639827e;pickupPointsHash=8435b3225284d4e57c63cf816087094d;'
      )
    })

    it('decodes productClusterIds segment from base64 cookie', () => {
      const segment = parseSegmentCookie(
        cookieHeader(segmentWithProductClusterBase64)
      )

      expect(segment.channel).toBe('1')
      expect(segment.regionId).toBe('v2.7DCB7CD533993562A2FC4EAFEC6B3DB4')
      expect(segment.countryCode).toBe('USA')
      expect(segment.cultureInfo).toBe('en-US')
      expect(segment.facets).toBe('productClusterIds=158;')
    })

    it('builds product-search query from shipping/geo segment cookie', () => {
      const segment = parseSegmentCookie(
        cookieHeader(segmentWithShippingBase64)
      )

      const request = buildIntelligentSearchRequest({
        endpoint: 'product-search',
        segment,
        defaults: {
          locale: 'pt-BR',
          salesChannel: 1,
          regionId: 'fallback-region-id',
          hideUnavailableItems: true,
          simulationBehavior: 'default',
          showSponsored: false,
        },
        args: {
          page: 0,
          count: 12,
          query: 'shampoo',
          selectedFacets: [{ key: 'category-1', value: 'cabelos' }],
        },
      })

      expect(request.path).toBe('category-1/cabelos/')

      expect(paramsToObject(request.params)).toEqual({
        from: '0',
        to: '11',
        query: 'shampoo',
        sc: '1',
        regionId: 'fallback-region-id',
        country: 'BRA',
        locale: 'pt-BR',
        'zip-code': '01002020',
        coordinates: '-46.63704681396485,-23.547204971313477',
        pickupPoint: 'mundodocabeleireiroloja55_29',
        deliveryZonesHash: '9753318426c13c1900b5fe57b639827e',
        pickupPointHash: '8435b3225284d4e57c63cf816087094d',
        hideUnavailableItems: 'true',
        simulationBehavior: 'default',
        showSponsored: 'false',
        allowRedirect: 'false',
      })
    })

    it('builds product-search query from productClusterIds segment cookie', () => {
      const segment = parseSegmentCookie(
        cookieHeader(segmentWithProductClusterBase64)
      )

      const request = buildIntelligentSearchRequest({
        endpoint: 'product-search',
        segment,
        defaults: {
          locale: 'en-US',
          salesChannel: 1,
          hideUnavailableItems: false,
          showSponsored: true,
        },
        args: {
          page: 1,
          count: 24,
          sort: 'price:asc',
          selectedFacets: [{ key: 'brand', value: 'nike' }],
        },
      })

      expect(request.path).toBe('brand/nike/')

      expect(paramsToObject(request.params)).toEqual({
        from: '24',
        to: '47',
        sort: 'price:asc',
        sc: '1',
        regionId: 'v2.7DCB7CD533993562A2FC4EAFEC6B3DB4',
        country: 'USA',
        locale: 'en-US',
        productClusterId: '158',
        hideUnavailableItems: 'false',
        showSponsored: 'true',
        allowRedirect: 'false',
      })
    })
  })
})
