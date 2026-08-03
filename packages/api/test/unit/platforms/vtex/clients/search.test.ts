import { beforeEach, describe, expect, it, vi } from 'vitest'

import { IntelligentSearch } from '../../../../../src/platforms/vtex/clients/search'
import type { GraphqlContext } from '../../../../../src/platforms/vtex'

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
