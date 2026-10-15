import { beforeEach, describe, expect, it, vi } from 'vitest'

import { IntelligentSearch } from '../../../../../src/platforms/vtex/clients/search'
import type { GraphqlContext } from '../../../../../src/platforms/vtex'
import type { Options } from '../../../../../src/typings/globals'

const searchOptions = {
  platform: 'vtex',
  account: 'storeframework',
  environment: 'vtexcommercestable',
  hideUnavailableItems: false,
  simulationBehavior: 'default' as const,
  showSponsored: false,
} as Options

const fetchAPIMocked = vi.fn()

beforeEach(() => {
  fetchAPIMocked.mockClear()
})

vi.mock('../../../../../src/platforms/vtex/clients/fetch.ts', () => ({
  fetchAPI: async (info: RequestInfo, init?: RequestInit) =>
    fetchAPIMocked(info, init),
}))

function makeCtx(overrides: {
  storageLocale?: string
  cookie?: string
  localizationEnabled?: boolean
}): GraphqlContext {
  return {
    id: 'test',
    clients: {} as GraphqlContext['clients'],
    loaders: {} as GraphqlContext['loaders'],
    storage: {
      channel: { salesChannel: '1', regionId: '', seller: '' },
      locale: overrides.storageLocale ?? '',
      flags: {} as GraphqlContext['storage']['flags'],
      cookies: new Map(),
    },
    headers: {
      cookie: overrides.cookie ?? '',
      host: 'localhost',
    },
    account: 'storeframework',
    OTEL: {},
    discoveryConfig:
      overrides.localizationEnabled != null
        ? { localization: { enabled: overrides.localizationEnabled } }
        : undefined,
  } as unknown as GraphqlContext
}

/** Parses the `locale` query param from the URL the mock was called with. */
function capturedLocale(): string | null {
  const [url] = fetchAPIMocked.mock.calls[0]
  return new URL(url).searchParams.get('locale')
}

describe('IntelligentSearch — getSegmentLocale priority', () => {
  it('prefers ctx.storage.locale over vtex_segment cookie when localization is enabled', async () => {
    // Simulate stale vtex_segment cookie from previous locale (en-US) while the
    // server-side ctx.storage.locale is already updated to it-IT.
    const enUSSegment = Buffer.from(
      JSON.stringify({ cultureInfo: 'en-US' })
    ).toString('base64')

    fetchAPIMocked.mockResolvedValueOnce({ products: { edges: [] } })

    const ctx = makeCtx({
      storageLocale: 'it-IT',
      cookie: `vtex_segment=${enUSSegment}`,
      localizationEnabled: true,
    })

    const is = IntelligentSearch(searchOptions, ctx)
    await is.products({ page: 0, count: 1 })

    expect(capturedLocale()).toBe('it-IT')
  })

  it('ignores ctx.storage.locale and uses vtex_segment cultureInfo when localization is disabled', async () => {
    // Non-localized stores: the cookie's cultureInfo is the authoritative source.
    const enUSSegment = Buffer.from(
      JSON.stringify({ cultureInfo: 'en-US' })
    ).toString('base64')

    fetchAPIMocked.mockResolvedValueOnce({ products: { edges: [] } })

    const ctx = makeCtx({
      storageLocale: 'it-IT', // should be ignored — localization disabled
      cookie: `vtex_segment=${enUSSegment}`,
      localizationEnabled: false,
    })

    const is = IntelligentSearch(searchOptions, ctx)
    await is.products({ page: 0, count: 1 })

    expect(capturedLocale()).toBe('en-US')
  })

  it('falls back to storage.locale for non-localized stores when no vtex_segment cookie is set', async () => {
    // First visit / no cookie — storage.locale is the safety net.
    fetchAPIMocked.mockResolvedValueOnce({ products: { edges: [] } })

    const ctx = makeCtx({
      storageLocale: 'pt-BR',
      cookie: '',
      localizationEnabled: false,
    })

    const is = IntelligentSearch(searchOptions, ctx)
    await is.products({ page: 0, count: 1 })

    expect(capturedLocale()).toBe('pt-BR')
  })

  it('falls back to vtex_segment cultureInfo when ctx.storage.locale is empty (localization enabled)', async () => {
    // base64 JSON: { "cultureInfo": "pt-BR" }
    const ptBRSegment = Buffer.from(
      JSON.stringify({ cultureInfo: 'pt-BR' })
    ).toString('base64')

    fetchAPIMocked.mockResolvedValueOnce({ products: { edges: [] } })

    const ctx = makeCtx({
      storageLocale: '',
      cookie: `vtex_segment=${ptBRSegment}`,
      localizationEnabled: true,
    })

    const is = IntelligentSearch(searchOptions, ctx)
    await is.products({ page: 0, count: 1 })

    expect(capturedLocale()).toBe('pt-BR')
  })

  it('omits the locale param when both ctx.storage.locale and cookie are absent', async () => {
    // buildIntelligentSearchRequest skips params with empty/falsy values, so
    // URLSearchParams.get('locale') returns null rather than ''.
    fetchAPIMocked.mockResolvedValueOnce({ products: { edges: [] } })

    const ctx = makeCtx({
      storageLocale: '',
      cookie: '',
      localizationEnabled: true,
    })

    const is = IntelligentSearch(searchOptions, ctx)
    await is.products({ page: 0, count: 1 })

    expect(capturedLocale()).toBeNull()
  })
})

describe('IntelligentSearch.pickupPointAvailability', () => {
  it('requests pickup-point availability with the postal code and segment country', async () => {
    const segment = Buffer.from(
      JSON.stringify({
        channel: 1,
        cultureInfo: 'pt-BR',
        countryCode: 'BRA',
        facets: 'zip-code=01002020;country=BRA;productClusterIds=158;',
      })
    ).toString('base64')

    fetchAPIMocked.mockResolvedValueOnce({ pickupPointDistances: [] })

    const is = IntelligentSearch(
      searchOptions,
      makeCtx({
        cookie: `vtex_segment=${segment}`,
        localizationEnabled: false,
      })
    )

    await is.pickupPointAvailability({ postalCode: '22271020' })

    const [url] = fetchAPIMocked.mock.calls[0]
    const parsed = new URL(url)

    expect(parsed.pathname).toBe(
      '/api/intelligent-search/v1/pickup-point-availability/productClusterIds/158/'
    )
    expect(parsed.searchParams.get('zip-code')).toBe('22271020')
    expect(parsed.searchParams.get('country')).toBe('BRA')
    expect(parsed.searchParams.get('deliveryZonesHash')).toBeNull()
  })

  it('omits the attribute path when the segment has no extra facets', async () => {
    const segment = Buffer.from(
      JSON.stringify({
        channel: 1,
        cultureInfo: 'pt-BR',
        countryCode: 'BRA',
        facets: 'zip-code=01002020;country=BRA;',
      })
    ).toString('base64')

    fetchAPIMocked.mockResolvedValueOnce({ pickupPointDistances: [] })

    const is = IntelligentSearch(
      searchOptions,
      makeCtx({ cookie: `vtex_segment=${segment}` })
    )

    await is.pickupPointAvailability({})

    const [url] = fetchAPIMocked.mock.calls[0]
    const parsed = new URL(url)

    expect(parsed.pathname).toBe(
      '/api/intelligent-search/v1/pickup-point-availability'
    )
    expect(parsed.searchParams.get('zip-code')).toBe('01002020')
  })

  it('sends the server sales channel instead of the segment cookie channel', async () => {
    const segment = Buffer.from(
      JSON.stringify({
        channel: 1,
        cultureInfo: 'pt-BR',
        countryCode: 'BRA',
        facets: 'zip-code=01002020;country=BRA;',
      })
    ).toString('base64')

    fetchAPIMocked.mockResolvedValueOnce({ pickupPointDistances: [] })

    const ctx = makeCtx({ cookie: `vtex_segment=${segment}` })
    ctx.storage.channel.salesChannel = '2'

    const is = IntelligentSearch(searchOptions, ctx)
    await is.pickupPointAvailability({
      postalCode: '01310100',
      country: 'BRA',
    })

    const [url] = fetchAPIMocked.mock.calls[0]

    expect(new URL(url).searchParams.get('sc')).toBe('2')
  })
})
