import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { Channel } from '../../../../../src/platforms/vtex/utils/channel'

const getAuthCookie = vi.fn(() => '')
const parseJwt = vi.fn(() => null as any)

vi.mock('../../../../../src/platforms/vtex/utils/cookies', async () => {
  const actual = await vi.importActual<
    typeof import('../../../../../src/platforms/vtex/utils/cookies')
  >('../../../../../src/platforms/vtex/utils/cookies')

  return {
    ...actual,
    getAuthCookie: (...args: unknown[]) => getAuthCookie(...args),
    parseJwt: (...args: unknown[]) => parseJwt(...args),
  }
})

const {
  buildB2bSession,
  buildMarketingData,
  buildPersonFromProfile,
  buildSessionSearchParams,
  getPreciseLocationData,
  resolveJwtClaims,
  resolveSellerInRegion,
} = await import(
  '../../../../../src/platforms/vtex/utils/validateSessionHelpers'
)

const baseChannel = (salesChannel = '1', seller = ''): Required<Channel> => ({
  salesChannel,
  regionId: '',
  seller,
  hasOnlyDefaultSalesChannel: true,
})

describe('buildSessionSearchParams', () => {
  it('sets sc from search or falls back to channel', () => {
    const fromSearch = buildSessionSearchParams(
      '?sc=4',
      baseChannel('1'),
      '',
      '',
      null,
      'pt-BR'
    )
    expect(fromSearch.get('sc')).toBe('4')
    expect(fromSearch.get('locale')).toBe('pt-BR')

    const fromChannel = buildSessionSearchParams(
      '',
      baseChannel('2'),
      '',
      '',
      null,
      'en-US'
    )
    expect(fromChannel.get('sc')).toBe('2')
  })

  it('drops facets and sets location params', () => {
    const params = buildSessionSearchParams(
      '?facets=category-1&utm_source=ads',
      baseChannel(),
      '01310-100',
      'BRA',
      { latitude: -23.5, longitude: -46.6 },
      'pt-BR'
    )

    expect(params.has('facets')).toBe(false)
    expect(params.get('postalCode')).toBe('01310-100')
    expect(params.get('country')).toBe('BRA')
    expect(params.get('geoCoordinates')).toBe('-46.6,-23.5')
    expect(params.get('utm_source')).toBe('ads')
  })
})

describe('buildMarketingData', () => {
  it('prefers query params over the previous session values', () => {
    const params = new URLSearchParams(
      'utm_campaign=c&utm_medium=m&utm_source=s&utmi_cp=cp&utmi_p=p&utmi_pc=pc'
    )

    expect(
      buildMarketingData(params, {
        utmCampaign: 'old',
        utmMedium: 'old',
        utmSource: 'old',
        utmiCampaign: 'old',
        utmiPage: 'old',
        utmiPart: 'old',
      })
    ).toEqual({
      utmCampaign: 'c',
      utmMedium: 'm',
      utmSource: 's',
      utmiCampaign: 'cp',
      utmiPage: 'p',
      utmiPart: 'pc',
    })
  })

  it('falls back to empty strings when nothing is set', () => {
    expect(buildMarketingData(new URLSearchParams(), null)).toEqual({
      utmCampaign: '',
      utmMedium: '',
      utmSource: '',
      utmiCampaign: '',
      utmiPage: '',
      utmiPart: '',
    })
  })
})

describe('buildPersonFromProfile', () => {
  it('returns null without a profile id', () => {
    expect(buildPersonFromProfile(null)).toBeNull()
    expect(buildPersonFromProfile({})).toBeNull()
  })

  it('maps profile fields into a Store person', () => {
    expect(
      buildPersonFromProfile({
        id: { value: 'p1' },
        email: { value: 'a@b.com' },
        firstName: { value: 'Ada' },
        lastName: { value: 'Lovelace' },
      })
    ).toEqual({
      id: 'p1',
      email: 'a@b.com',
      givenName: 'Ada',
      familyName: 'Lovelace',
    })
  })
})

describe('buildB2bSession', () => {
  it('returns null when the shopper is not a representative', () => {
    expect(
      buildB2bSession({
        isRepresentative: false,
        authentication: null,
        shopper: null,
        publicData: null,
        profile: null,
        contract: null,
      })
    ).toBeNull()
  })

  it('builds B2B fields from authentication and shopper namespaces', () => {
    expect(
      buildB2bSession({
        isRepresentative: true,
        authentication: {
          customerId: { value: 'cust' },
          unitName: { value: 'Unit' },
          unitId: { value: 'u1' },
          storeUserEmail: { value: 'rep@vtex.com' },
        },
        shopper: {
          firstName: { value: 'Jane' },
          lastName: { value: 'Doe' },
          organizationManager: { value: true },
        },
        publicData: { postalCode: { value: '12345' } },
        profile: { id: { value: 'p1' } },
        contract: { corporateName: 'Acme' },
        customerId: 'fallback-cust',
        unitId: 'fallback-unit',
      })
    ).toMatchObject({
      isRepresentative: true,
      customerId: 'cust',
      unitName: 'Unit',
      unitId: 'u1',
      firstName: 'Jane',
      lastName: 'Doe',
      userName: 'Jane Doe',
      userEmail: 'rep@vtex.com',
      savedPostalCode: '12345',
      contractName: 'Acme',
      organizationManager: true,
    })
  })

  it('ignores non-string shopper name values', () => {
    const result = buildB2bSession({
      isRepresentative: true,
      authentication: null,
      shopper: {
        firstName: { value: 123 },
        lastName: { value: null },
      },
      publicData: null,
      profile: null,
      contract: null,
      customerId: 'c',
      unitId: 'u',
    })

    expect(result).toMatchObject({
      firstName: '',
      lastName: '',
      userName: '',
      customerId: 'c',
      unitId: 'u',
    })
  })
})

describe('getPreciseLocationData', () => {
  it('maps checkout address geoCoordinates', async () => {
    const address = vi.fn().mockResolvedValue({
      city: 'São Paulo',
      geoCoordinates: [-46.6, -23.5],
    })
    const clients = { commerce: { checkout: { address } } } as any

    await expect(
      getPreciseLocationData(clients, 'BRA', '01310-100')
    ).resolves.toEqual({
      city: 'São Paulo',
      geoCoordinates: { latitude: -23.5, longitude: -46.6 },
    })
  })

  it('returns null geoCoordinates when the address has none', async () => {
    const clients = {
      commerce: {
        checkout: {
          address: vi
            .fn()
            .mockResolvedValue({ city: 'X', geoCoordinates: null }),
        },
      },
    } as any

    await expect(getPreciseLocationData(clients, 'BRA', '1')).resolves.toEqual({
      city: 'X',
      geoCoordinates: null,
    })
  })

  it('rethrows after logging when address lookup fails', async () => {
    const error = new Error('boom')
    const clients = {
      commerce: {
        checkout: { address: vi.fn().mockRejectedValue(error) },
      },
    } as any
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {})

    await expect(getPreciseLocationData(clients, 'BRA', '1')).rejects.toThrow(
      'boom'
    )
    expect(spy).toHaveBeenCalled()
    spy.mockRestore()
  })
})

describe('resolveSellerInRegion', () => {
  it('skips the region lookup without a seller or location', async () => {
    const region = vi.fn()
    const clients = { commerce: { checkout: { region } } } as any

    await expect(
      resolveSellerInRegion(clients, baseChannel(), '', null, 'BRA', '1')
    ).resolves.toBeUndefined()
    expect(region).not.toHaveBeenCalled()
  })

  it('returns the matching seller id from region data', async () => {
    const region = vi.fn().mockResolvedValue([
      {
        sellers: [{ id: '1' }, { id: 'seller-a' }],
      },
    ])
    const clients = { commerce: { checkout: { region } } } as any

    await expect(
      resolveSellerInRegion(
        clients,
        baseChannel('1', 'seller-a'),
        '01310-100',
        null,
        'BRA',
        '1'
      )
    ).resolves.toBe('seller-a')
  })
})

describe('resolveJwtClaims', () => {
  beforeEach(() => {
    getAuthCookie.mockReset()
    parseJwt.mockReset()
    getAuthCookie.mockReturnValue('')
    parseJwt.mockReturnValue(null)
  })

  it('returns empty claims when there is no auth cookie', async () => {
    const validate = vi.fn()
    const clients = { commerce: { vtexid: { validate } } } as any

    await expect(
      resolveJwtClaims(clients, undefined, 'storeframework')
    ).resolves.toEqual({
      isRepresentative: false,
      customerId: undefined,
      unitId: undefined,
    })
    expect(validate).not.toHaveBeenCalled()
  })

  it('reads claims when VTEX ID validates the JWT', async () => {
    getAuthCookie.mockReturnValue('jwt-token')
    parseJwt.mockReturnValue({
      isRepresentative: true,
      customerId: 'cust-1',
      unitId: 'unit-1',
    })
    const validate = vi.fn().mockResolvedValue({ authStatus: 'Success' })
    const clients = { commerce: { vtexid: { validate } } } as any

    await expect(
      resolveJwtClaims(clients, 'cookie', 'storeframework')
    ).resolves.toEqual({
      isRepresentative: true,
      customerId: 'cust-1',
      unitId: 'unit-1',
    })
  })

  it('clears claims when VTEX ID validation throws', async () => {
    getAuthCookie.mockReturnValue('jwt-token')
    parseJwt.mockReturnValue({
      isRepresentative: true,
      customerId: 'cust-1',
      unitId: 'unit-1',
    })
    const validate = vi.fn().mockRejectedValue(new Error('invalid'))
    const clients = { commerce: { vtexid: { validate } } } as any
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})

    await expect(
      resolveJwtClaims(clients, 'cookie', 'storeframework')
    ).resolves.toEqual({
      isRepresentative: false,
      customerId: undefined,
      unitId: undefined,
    })
    expect(warn).toHaveBeenCalled()
    warn.mockRestore()
  })
})
