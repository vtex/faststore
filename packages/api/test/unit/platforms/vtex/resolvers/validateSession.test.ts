import { beforeEach, describe, expect, it, vi } from 'vitest'

import { validateSession } from '../../../../../src/platforms/vtex/resolvers/validateSession'
import ChannelMarshal from '../../../../../src/platforms/vtex/utils/channel'

const baseSession = {
  locale: 'pt-BR',
  currency: { code: 'BRL', symbol: 'R$' },
  country: 'BRA',
  channel: ChannelMarshal.stringify({
    salesChannel: '1',
    regionId: '',
    seller: '',
    hasOnlyDefaultSalesChannel: true,
  }),
  deliveryMode: null,
  addressType: null,
  city: 'São Paulo',
  postalCode: null,
  geoCoordinates: { latitude: -23.5, longitude: -46.6 },
  person: null,
  b2b: null,
  marketingData: {
    utmCampaign: '',
    utmMedium: '',
    utmSource: '',
    utmiCampaign: '',
    utmiPage: '',
    utmiPart: '',
  },
  refreshAfter: null,
}

const makeContext = (sessionNamespaces: Record<string, unknown> = {}) => {
  const session = vi.fn().mockResolvedValue({
    namespaces: {
      store: {
        channel: { value: '1' },
        currencyCode: { value: 'BRL' },
        currencySymbol: { value: 'R$' },
        countryCode: { value: 'BRA' },
      },
      checkout: { regionId: { value: '' } },
      profile: null,
      shopper: null,
      authentication: null,
      public: null,
      ...sessionNamespaces,
    },
  })

  return {
    clients: {
      commerce: {
        session,
        checkout: {
          address: vi.fn(),
          region: vi.fn(),
        },
        vtexid: { validate: vi.fn() },
        masterData: { getContractById: vi.fn() },
      },
    },
    headers: { cookie: '' },
    account: 'sabrinastore',
  } as any
}

describe('validateSession', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('keeps an explicit client sales channel when Session Manager diverges', async () => {
    const ctx = makeContext({
      store: {
        channel: { value: '1' },
        currencyCode: { value: 'BRL' },
        currencySymbol: { value: 'R$' },
        countryCode: { value: 'BRA' },
      },
    })
    const oldSession = {
      ...baseSession,
      channel: ChannelMarshal.stringify({
        salesChannel: '2',
        regionId: '',
        seller: '',
        hasOnlyDefaultSalesChannel: false,
      }),
    }

    const result = await validateSession(
      null,
      { session: oldSession, search: '' },
      ctx
    )

    expect(result).not.toBeNull()
    expect(JSON.parse(result!.channel!)).toMatchObject({
      salesChannel: '2',
      hasOnlyDefaultSalesChannel: false,
    })
  })

  it('adopts Session Manager sales channel for the default client channel', async () => {
    const ctx = makeContext({
      store: {
        channel: { value: '4' },
        currencyCode: { value: 'BRL' },
        currencySymbol: { value: 'R$' },
        countryCode: { value: 'BRA' },
      },
    })

    const result = await validateSession(
      null,
      { session: baseSession, search: '' },
      ctx
    )

    expect(JSON.parse(result!.channel!)).toMatchObject({
      salesChannel: '4',
      hasOnlyDefaultSalesChannel: false,
    })
  })

  it('survives Session Manager failures', async () => {
    const ctx = makeContext()
    ctx.clients.commerce.session.mockRejectedValue(new Error('session down'))

    const result = await validateSession(
      null,
      { session: baseSession, search: '' },
      ctx
    )

    expect(result).not.toBeNull()
    expect(JSON.parse(result!.channel!).salesChannel).toBe('1')
  })

  it('loads precise location when city/geo are missing', async () => {
    const ctx = makeContext()
    ctx.clients.commerce.checkout.address.mockResolvedValue({
      city: 'Curitiba',
      geoCoordinates: [-49.2, -25.4],
    })

    const result = await validateSession(
      null,
      {
        session: {
          ...baseSession,
          city: null,
          geoCoordinates: null,
          postalCode: '80010-000',
        },
        search: '',
      },
      ctx
    )

    expect(ctx.clients.commerce.checkout.address).toHaveBeenCalled()
    expect(result?.city).toBe('Curitiba')
    expect(result?.geoCoordinates).toEqual({
      latitude: -25.4,
      longitude: -49.2,
    })
  })

  it('maps profile into person when Session Manager returns one', async () => {
    const ctx = makeContext({
      profile: {
        id: { value: 'p1' },
        email: { value: 'a@b.com' },
        firstName: { value: 'Ada' },
        lastName: { value: 'Lovelace' },
      },
    })

    const result = await validateSession(
      null,
      { session: baseSession, search: '' },
      ctx
    )

    expect(result?.person).toEqual({
      id: 'p1',
      email: 'a@b.com',
      givenName: 'Ada',
      familyName: 'Lovelace',
    })
  })

  it('resolves a seller when channel has one and postal code is set', async () => {
    const ctx = makeContext()
    ctx.clients.commerce.checkout.region.mockResolvedValue([
      { sellers: [{ id: 'seller-a' }] },
    ])

    const result = await validateSession(
      null,
      {
        session: {
          ...baseSession,
          postalCode: '01310-100',
          channel: ChannelMarshal.stringify({
            salesChannel: '1',
            regionId: '',
            seller: 'seller-a',
            hasOnlyDefaultSalesChannel: true,
          }),
        },
        search: '',
      },
      ctx
    )

    expect(ctx.clients.commerce.checkout.region).toHaveBeenCalled()
    expect(JSON.parse(result!.channel!).seller).toBe('seller-a')
  })
})
