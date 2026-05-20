import { beforeEach, describe, expect, it, vi } from 'vitest'
import * as clients from '../../../../../src/platforms/vtex/clients'
// This should be imported AFTER the '../../../../../src/platforms/vtex/clients'
import { GraphqlVtexContextFactory } from '../../../../../src/platforms/vtex'

const apiOptions = {
  platform: 'vtex',
  account: 'storeframework',
  environment: 'vtexcommercestable',
  channel: '{"salesChannel":"1"}',
  locale: 'en-US',
  subDomainPrefix: ['www'],
  hideUnavailableItems: false,
  incrementAddress: false,
  flags: {
    enableOrderFormSync: true,
  },
} as Options

const fetchAPIMocked = vi.fn()

beforeEach(() => {
  fetchAPIMocked.mockClear()
  fetchAPIMocked.mockResolvedValue({})
})

vi.mock('../../../../../src/platforms/vtex/clients/fetch.ts', () => ({
  fetchAPI: async (
    info: RequestInfo,
    init?: RequestInit,
    options?: { storeCookies?: (headers: Headers) => void }
  ) => fetchAPIMocked(info, init, options),
}))

const buildSearch = async (headers: Record<string, string> = {}) => {
  const contextFactory = await GraphqlVtexContextFactory(apiOptions)
  const context = contextFactory({ headers })
  return clients.getClients(apiOptions, context).search
}

describe('IntelligentSearch headers forwarding', () => {
  it('forwards CloudFront viewer-location headers when present', async () => {
    const search = await buildSearch({
      'cloudfront-viewer-country': 'BR',
      'cloudfront-viewer-city': 'São Paulo',
      'cloudfront-viewer-postal-code': '01000-000',
      'cloudfront-viewer-latitude': '-23.55',
      'cloudfront-viewer-longitude': '-46.63',
    })

    await search.products({ page: 0, count: 12 })

    expect(fetchAPIMocked).toHaveBeenCalledTimes(1)
    const init = fetchAPIMocked.mock.calls[0][1] as RequestInit
    const sentHeaders = init.headers as Record<string, string>

    expect(sentHeaders['CloudFront-Viewer-Country']).toBe('BR')
    expect(sentHeaders['CloudFront-Viewer-City']).toBe('São Paulo')
    expect(sentHeaders['CloudFront-Viewer-Postal-Code']).toBe('01000-000')
    expect(sentHeaders['CloudFront-Viewer-Latitude']).toBe('-23.55')
    expect(sentHeaders['CloudFront-Viewer-Longitude']).toBe('-46.63')
  })

  it('forwards CloudFront viewer-location headers on every IS endpoint', async () => {
    const search = await buildSearch({
      'cloudfront-viewer-country': 'BR',
    })

    await search.products({ page: 0, count: 12 })
    await search.facets({ page: 0, count: 12 })
    await search.suggestedTerms({ page: 0, count: 12, query: 'shoe' })
    await search.topSearches()
    await search.productCount({ query: 'shoe' })

    expect(fetchAPIMocked).toHaveBeenCalledTimes(5)
    for (const call of fetchAPIMocked.mock.calls) {
      const sentHeaders = (call[1] as RequestInit).headers as Record<
        string,
        string
      >
      expect(sentHeaders['CloudFront-Viewer-Country']).toBe('BR')
    }
  })

  it('does not add CloudFront viewer-location headers when none are present', async () => {
    const search = await buildSearch({ host: 'example.com' })

    await search.products({ page: 0, count: 12 })

    expect(fetchAPIMocked).toHaveBeenCalledTimes(1)
    const init = fetchAPIMocked.mock.calls[0][1] as RequestInit
    const sentHeaders = init.headers as Record<string, string>

    for (const key of Object.keys(sentHeaders)) {
      expect(key.toLowerCase()).not.toMatch(/^cloudfront-viewer-/)
    }
  })

  it('does not synthesize empty values for missing CloudFront headers', async () => {
    const search = await buildSearch({
      'cloudfront-viewer-country': 'BR',
    })

    await search.products({ page: 0, count: 12 })

    const init = fetchAPIMocked.mock.calls[0][1] as RequestInit
    const sentHeaders = init.headers as Record<string, string>

    expect(sentHeaders).not.toHaveProperty('CloudFront-Viewer-City')
    expect(sentHeaders).not.toHaveProperty('CloudFront-Viewer-Postal-Code')
  })

  it('preserves existing X-FORWARDED-HOST and content-type headers', async () => {
    const search = await buildSearch({
      host: 'example.com',
      'cloudfront-viewer-country': 'BR',
    })

    await search.products({ page: 0, count: 12 })

    const init = fetchAPIMocked.mock.calls[0][1] as RequestInit
    const sentHeaders = init.headers as Record<string, string>

    expect(sentHeaders['content-type']).toBe('application/json')
    expect(sentHeaders['X-FORWARDED-HOST']).toBe('example.com')
  })
})
