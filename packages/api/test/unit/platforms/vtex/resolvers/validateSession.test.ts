import { beforeEach, describe, expect, it, vi } from 'vitest'

import { validateSession } from '../../../../../src/platforms/vtex/resolvers/validateSession'
import ChannelMarshal from '../../../../../src/platforms/vtex/utils/channel'
import {
  ForbiddenError,
  UnauthorizedError,
} from '../../../../../src/platforms/errors'

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

  it('follows Session Manager for a legacy pinned channel without marker', async () => {
    const ctx = makeContext({
      store: {
        channel: { value: '4' },
        currencyCode: { value: 'BRL' },
        currencySymbol: { value: 'R$' },
        countryCode: { value: 'BRA' },
      },
    })
    const oldSession = {
      ...baseSession,
      channel: ChannelMarshal.stringify({
        salesChannel: '1',
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

    expect(JSON.parse(result!.channel!)).toMatchObject({
      salesChannel: '4',
      hasOnlyDefaultSalesChannel: false,
    })
  })

  it('keeps an orderForm-adopted sales channel and its marker', async () => {
    const ctx = makeContext()
    const oldSession = {
      ...baseSession,
      channel: JSON.stringify({
        salesChannel: '2',
        regionId: '',
        seller: '',
        hasOnlyDefaultSalesChannel: false,
        salesChannelSource: 'orderForm',
      }),
    }

    const result = await validateSession(
      null,
      { session: oldSession, search: '' },
      ctx
    )

    expect(ctx.clients.commerce.session).toHaveBeenCalledTimes(1)
    expect(
      new URLSearchParams(ctx.clients.commerce.session.mock.calls[0][0]).get(
        'sc'
      )
    ).toBe('2')
    expect(result).not.toBeNull()
    expect(JSON.parse(result!.channel!)).toMatchObject({
      salesChannel: '2',
      salesChannelSource: 'orderForm',
    })
  })

  it('retries without `sc` when Session Manager rejects the requested SC', async () => {
    const ctx = makeContext({
      store: {
        channel: { value: '4' },
        currencyCode: { value: 'BRL' },
        currencySymbol: { value: 'R$' },
        countryCode: { value: 'BRA' },
      },
    })
    const sessionResponse =
      await ctx.clients.commerce.session.getMockImplementation()!()
    ctx.clients.commerce.session
      .mockReset()
      .mockRejectedValueOnce(new UnauthorizedError('restricted SC'))
      .mockResolvedValueOnce(sessionResponse)
    const oldSession = {
      ...baseSession,
      channel: ChannelMarshal.stringify({
        salesChannel: '1',
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

    const [first, retry] = ctx.clients.commerce.session.mock.calls.map(
      ([search]: [string]) => new URLSearchParams(search)
    )

    expect(first.get('sc')).toBe('1')
    expect(retry.has('sc')).toBe(false)
    expect(JSON.parse(result!.channel!).salesChannel).toBe('4')
  })

  describe('seller resolution sales channel', () => {
    const regionalizedSession = {
      ...baseSession,
      postalCode: '01310-100',
      channel: ChannelMarshal.stringify({
        salesChannel: '1',
        regionId: '',
        seller: 'seller-a',
        hasOnlyDefaultSalesChannel: false,
      }),
    }

    const regionalizedContext = () => {
      const ctx = makeContext({
        store: {
          channel: { value: '4' },
          currencyCode: { value: 'BRL' },
          currencySymbol: { value: 'R$' },
          countryCode: { value: 'BRA' },
        },
      })
      ctx.clients.commerce.checkout.region.mockResolvedValue([
        { sellers: [{ id: 'seller-a' }] },
      ])

      return ctx
    }

    it('uses the requested `sc` when Session Manager accepts it', async () => {
      const ctx = regionalizedContext()

      await validateSession(
        null,
        { session: regionalizedSession, search: '' },
        ctx
      )

      expect(ctx.clients.commerce.checkout.region).toHaveBeenCalledWith(
        expect.objectContaining({ salesChannel: '1' })
      )
    })

    it('uses the SC resolved by Session Manager after a rejected `sc`', async () => {
      const ctx = regionalizedContext()
      const sessionResponse =
        await ctx.clients.commerce.session.getMockImplementation()!()
      ctx.clients.commerce.session
        .mockReset()
        .mockRejectedValueOnce(new UnauthorizedError('restricted SC'))
        .mockResolvedValueOnce(sessionResponse)

      const result = await validateSession(
        null,
        { session: regionalizedSession, search: '' },
        ctx
      )

      expect(ctx.clients.commerce.checkout.region).toHaveBeenCalledWith(
        expect.objectContaining({ salesChannel: '4' })
      )
      expect(JSON.parse(result!.channel!)).toMatchObject({
        salesChannel: '4',
        seller: 'seller-a',
      })
    })

    it('falls back to the client SC when the retry also fails', async () => {
      const ctx = regionalizedContext()
      ctx.clients.commerce.session
        .mockReset()
        .mockRejectedValueOnce(new UnauthorizedError('restricted SC'))
        .mockRejectedValueOnce(new Error('session down'))

      await validateSession(
        null,
        { session: regionalizedSession, search: '' },
        ctx
      )

      expect(ctx.clients.commerce.checkout.region).toHaveBeenCalledWith(
        expect.objectContaining({ salesChannel: '1' })
      )
    })
  })

  describe('rejected orderForm-adopted sales channel', () => {
    const adoptedSession = (extra: Record<string, unknown> = {}) => ({
      ...baseSession,
      channel: JSON.stringify({
        salesChannel: '6',
        regionId: '',
        seller: '',
        hasOnlyDefaultSalesChannel: false,
        salesChannelSource: 'orderForm',
        ...extra,
      }),
    })

    const contextResolving = (salesChannel: string) => {
      const ctx = makeContext({
        store: {
          channel: { value: salesChannel },
          currencyCode: { value: 'BRL' },
          currencySymbol: { value: 'R$' },
          countryCode: { value: 'BRA' },
        },
      })

      return ctx
    }

    it('drops the marker, retries without `sc` and records the rejected SC', async () => {
      const ctx = contextResolving('4')
      const sessionResponse =
        await ctx.clients.commerce.session.getMockImplementation()!()
      ctx.clients.commerce.session
        .mockReset()
        .mockRejectedValueOnce(new UnauthorizedError('restricted SC'))
        .mockResolvedValueOnce(sessionResponse)

      const result = await validateSession(
        null,
        { session: adoptedSession(), search: '' },
        ctx
      )

      const [first, retry] = ctx.clients.commerce.session.mock.calls.map(
        ([search]: [string]) => new URLSearchParams(search)
      )
      const channel = JSON.parse(result!.channel!)

      expect(first.get('sc')).toBe('6')
      expect(retry.has('sc')).toBe(false)
      expect(channel).toMatchObject({
        salesChannel: '4',
        rejectedSalesChannel: '6',
      })
      expect(channel).not.toHaveProperty('salesChannelSource')
    })

    it('keeps the adoption when the retry also fails', async () => {
      const ctx = makeContext()
      ctx.clients.commerce.session
        .mockReset()
        .mockRejectedValueOnce(new ForbiddenError('restricted SC'))
        .mockRejectedValueOnce(new Error('session down'))

      const result = await validateSession(
        null,
        { session: adoptedSession(), search: '' },
        ctx
      )

      const channel = JSON.parse(result!.channel!)

      expect(ctx.clients.commerce.session).toHaveBeenCalledTimes(2)
      // The marker (not this flag) keeps the SC; the flag keeps its pre-4.6
      // meaning: Session Manager returned no `store.channel`.
      expect(channel).toMatchObject({
        salesChannel: '6',
        salesChannelSource: 'orderForm',
        hasOnlyDefaultSalesChannel: true,
      })
      expect(channel).not.toHaveProperty('rejectedSalesChannel')
    })

    it('does not retry a rejected URL-derived SC', async () => {
      const ctx = makeContext()
      ctx.clients.commerce.session.mockRejectedValue(
        new ForbiddenError('restricted SC')
      )

      const result = await validateSession(
        null,
        { session: adoptedSession({ salesChannelSource: 'url' }), search: '' },
        ctx
      )

      expect(ctx.clients.commerce.session).toHaveBeenCalledTimes(1)
      expect(JSON.parse(result!.channel!)).toMatchObject({
        salesChannel: '6',
        salesChannelSource: 'url',
      })
    })

    it('keeps a recorded rejection on later validations', async () => {
      const ctx = contextResolving('4')

      const session = {
        ...baseSession,
        channel: JSON.stringify({
          salesChannel: '4',
          regionId: '',
          seller: '',
          hasOnlyDefaultSalesChannel: false,
          rejectedSalesChannel: '6',
        }),
      }

      const result = await validateSession(null, { session, search: '' }, ctx)

      // `null` means the session is unchanged, rejection included.
      expect(JSON.parse((result ?? session).channel!)).toMatchObject({
        salesChannel: '4',
        rejectedSalesChannel: '6',
      })
    })
  })

  it('does not retry on non-authorization failures', async () => {
    const ctx = makeContext()
    ctx.clients.commerce.session.mockRejectedValue(new Error('session down'))

    await validateSession(null, { session: baseSession, search: '' }, ctx)

    expect(ctx.clients.commerce.session).toHaveBeenCalledTimes(1)
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
