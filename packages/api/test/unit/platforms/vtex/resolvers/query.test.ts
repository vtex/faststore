import { beforeEach, describe, expect, it, vi } from 'vitest'

import { NotFoundError } from '../../../../../src/platforms/errors'
import { Query } from '../../../../../src/platforms/vtex/resolvers/query'

const session = vi.fn()

const makeCtx = () =>
  ({
    account: 'b2bfaststoredev',
    headers: { cookie: 'VtexIdclientAutCookie_b2bfaststoredev=token' },
    clients: {
      commerce: {
        session,
      },
    },
  }) as any

const availableContracts = (Query as any).availableContracts

const sessionContracts = [
  {
    customerId: 'a',
    contractName: 'Corp A',
    isActive: true,
    isCurrent: false,
  },
  {
    customerId: 'b',
    contractName: 'Corp B',
    isActive: true,
    isCurrent: true,
  },
  {
    customerId: 'c',
    contractName: 'Corp C',
    isActive: true,
    isCurrent: false,
  },
]

beforeEach(() => {
  vi.clearAllMocks()
  session.mockResolvedValue({
    namespaces: {
      authentication: { unitId: { value: 'unit-1' } },
      shopper: {
        availableContracts: { value: sessionContracts },
      },
    },
  })
})

describe('Query.availableContracts', () => {
  it('throws when orgUnitId is missing', async () => {
    await expect(
      availableContracts(null, { orgUnitId: '' }, makeCtx())
    ).rejects.toThrow(/orgUnitId/i)
    expect(session).not.toHaveBeenCalled()
  })

  it('forbids listing contracts for a different organization unit', async () => {
    await expect(
      availableContracts(null, { orgUnitId: 'other-unit' }, makeCtx())
    ).rejects.toThrow(/not allowed/i)
    expect(session).toHaveBeenCalledTimes(1)
  })

  it('lists session contracts and flags the current one', async () => {
    const result = await availableContracts(
      null,
      { orgUnitId: 'unit-1' },
      makeCtx()
    )

    expect(session).toHaveBeenCalledTimes(1)
    expect(result).toEqual([
      { id: 'a', corporateName: 'Corp A', isActive: false },
      { id: 'b', corporateName: 'Corp B', isActive: true },
      { id: 'c', corporateName: 'Corp C', isActive: false },
    ])
  })

  it('skips contracts without a name or inactive contracts', async () => {
    session.mockResolvedValue({
      namespaces: {
        authentication: { unitId: { value: 'unit-1' } },
        shopper: {
          availableContracts: {
            value: [
              {
                customerId: 'a',
                contractName: 'Corp A',
                isActive: true,
                isCurrent: true,
              },
              {
                customerId: 'b',
                contractName: '',
                isActive: true,
                isCurrent: false,
              },
              {
                customerId: 'c',
                contractName: 'Corp C',
                isActive: false,
                isCurrent: false,
              },
            ],
          },
        },
      },
    })

    const result = await availableContracts(
      null,
      { orgUnitId: 'unit-1' },
      makeCtx()
    )

    expect(result).toEqual([
      { id: 'a', corporateName: 'Corp A', isActive: true },
    ])
  })

  it('prefers activeContractId over stale isCurrent flags', async () => {
    session.mockResolvedValue({
      namespaces: {
        authentication: {
          unitId: { value: 'unit-1' },
          customerId: { value: 'c' },
        },
        shopper: {
          activeContractId: { value: 'c' },
          availableContracts: {
            value: [
              {
                customerId: 'a',
                contractName: 'Corp A',
                isActive: true,
                isCurrent: true,
              },
              {
                customerId: 'c',
                contractName: 'Corp C',
                isActive: true,
                isCurrent: false,
              },
            ],
          },
        },
      },
    })

    const result = await availableContracts(
      null,
      { orgUnitId: 'unit-1' },
      makeCtx()
    )

    expect(result).toEqual([
      { id: 'a', corporateName: 'Corp A', isActive: false },
      { id: 'c', corporateName: 'Corp C', isActive: true },
    ])
  })

  it('returns an empty list when the session has no attached contracts', async () => {
    session.mockResolvedValue({
      namespaces: {
        authentication: { unitId: { value: 'unit-1' } },
        shopper: {
          availableContracts: { value: [] },
        },
      },
    })

    const result = await availableContracts(
      null,
      { orgUnitId: 'unit-1' },
      makeCtx()
    )

    expect(result).toEqual([])
  })

  it('rejects listing when session lookup fails and no unit id is available', async () => {
    session.mockRejectedValueOnce(new Error('session unavailable'))

    await expect(
      availableContracts(null, { orgUnitId: 'unit-1' }, makeCtx())
    ).rejects.toThrow(/not allowed/i)
  })

  it('resolves active contract id from jwt when session omits it', async () => {
    session.mockResolvedValueOnce({
      namespaces: {
        authentication: { unitId: { value: 'unit-1' } },
        shopper: {
          availableContracts: {
            value: [
              {
                customerId: 'jwt-contract',
                contractName: 'JWT Corp',
                isActive: true,
                isCurrent: false,
              },
            ],
          },
        },
      },
    })

    const jwtPayload = Buffer.from(
      JSON.stringify({ unitId: 'unit-1', customerId: 'jwt-contract' })
    ).toString('base64url')
    const token = `header.${jwtPayload}.signature`

    const ctx = makeCtx()
    ctx.headers = {
      cookie: `VtexIdclientAutCookie_b2bfaststoredev=${token}`,
    }

    const result = await availableContracts(null, { orgUnitId: 'unit-1' }, ctx)

    expect(result).toEqual([
      { id: 'jwt-contract', corporateName: 'JWT Corp', isActive: true },
    ])
  })
})

// ─── Fixtures ───────────────────────────────────────────────────────────────

function makeSku(isVariantOfOverrides: Record<string, unknown> = {}) {
  return {
    itemId: '100',
    sellers: [],
    isVariantOf: {
      linkText: 'blue-shirt',
      productId: 'prod1',
      ...isVariantOfOverrides,
    },
  } as any
}

function makeSearchProduct(overrides: Record<string, unknown> = {}) {
  return {
    productId: 'prod1',
    linkText: 'blue-shirt',
    items: [{ itemId: '55', sellers: [{ commertialOffer: {} }] }],
    ...overrides,
  } as any
}

type Locator = Array<{ key: string; value: string }>

function makeProductCtx({
  localizationEnabled = false,
  locale = 'en-US',
  locales = {},
  defaultLocale = 'en-US',
  load = vi.fn(),
  getLocalizedProduct = vi.fn(),
  pagetype = vi.fn(),
  fetchProduct = vi.fn(),
}: {
  localizationEnabled?: boolean
  locale?: string
  locales?: Record<string, unknown>
  defaultLocale?: string
  load?: (...args: any[]) => Promise<any>
  getLocalizedProduct?: (...args: any[]) => Promise<any>
  pagetype?: (...args: any[]) => Promise<any>
  fetchProduct?: (...args: any[]) => Promise<any>
} = {}) {
  return {
    storage: { locale },
    discoveryConfig: {
      localization: localizationEnabled
        ? { enabled: true, locales, defaultLocale }
        : undefined,
    },
    loaders: { skuLoader: { load } },
    clients: {
      catalog: { getLocalizedProduct },
      commerce: { catalog: { portal: { pagetype } } },
      search: { fetchProduct },
    },
  } as any
}

const callProduct = (locator: Locator, ctx: any) =>
  (Query.product as any)(null, { locator }, ctx)

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('Query.product', () => {
  describe('happy path (no fallback)', () => {
    it('loads the sku by id when only an id facet is present', async () => {
      const sku = makeSku()
      const load = vi.fn().mockResolvedValue(sku)
      const pagetype = vi.fn()
      const ctx = makeProductCtx({ load, pagetype })

      const result = await callProduct([{ key: 'id', value: '100' }], ctx)

      expect(load).toHaveBeenCalledWith('100')
      expect(result).toBe(sku)
      expect(pagetype).not.toHaveBeenCalled()
    })

    it('derives the skuId from the slug suffix when no id facet is present', async () => {
      const sku = makeSku()
      const load = vi.fn().mockResolvedValue(sku)
      const ctx = makeProductCtx({ load })

      await callProduct([{ key: 'slug', value: 'blue-shirt-100' }], ctx)

      expect(load).toHaveBeenCalledWith('100')
    })

    it('sets the channel on context when a channel facet is present', async () => {
      const load = vi.fn().mockResolvedValue(makeSku())
      const ctx = makeProductCtx({ load })
      const channel = JSON.stringify({ salesChannel: '2' })

      await callProduct(
        [
          { key: 'id', value: '100' },
          { key: 'channel', value: channel },
        ],
        ctx
      )

      expect(ctx.storage.channel).toMatchObject({ salesChannel: '2' })
    })

    it('sets the locale on context when a locale facet is present', async () => {
      const load = vi.fn().mockResolvedValue(makeSku())
      const ctx = makeProductCtx({ load })

      await callProduct(
        [
          { key: 'id', value: '100' },
          { key: 'locale', value: 'pt-BR' },
        ],
        ctx
      )

      expect(ctx.storage.locale).toBe('pt-BR')
    })

    it('returns the sku directly when the slug prefix matches linkText', async () => {
      const sku = makeSku({ linkText: 'blue-shirt' })
      const load = vi.fn().mockResolvedValue(sku)
      const ctx = makeProductCtx({ load })

      const result = await callProduct(
        [{ key: 'slug', value: 'blue-shirt-100' }],
        ctx
      )

      expect(result).toBe(sku)
    })
  })

  describe('localized slug validation', () => {
    it('returns the sku when the slug is a valid localized match', async () => {
      const sku = makeSku({ linkText: 'blue-shirt' })
      const load = vi.fn().mockResolvedValue(sku)
      const getLocalizedProduct = vi.fn().mockResolvedValue({
        linkId: 'camisa-azul',
        categories: [],
        availableLinkIds: {},
      })
      const pagetype = vi.fn()
      const ctx = makeProductCtx({
        load,
        getLocalizedProduct,
        pagetype,
        localizationEnabled: true,
        locale: 'pt-BR',
      })

      const result = await callProduct(
        [
          { key: 'slug', value: 'camisa-azul-100' },
          { key: 'locale', value: 'pt-BR' },
        ],
        ctx
      )

      expect(result).toBe(sku)
      expect(getLocalizedProduct).toHaveBeenCalledWith('prod1', 'pt-BR')
      expect(pagetype).not.toHaveBeenCalled()
    })

    it('falls back when localization is enabled but the localized linkId does not match', async () => {
      const load = vi
        .fn()
        .mockResolvedValue(makeSku({ linkText: 'blue-shirt' }))
      const getLocalizedProduct = vi.fn().mockResolvedValue({
        linkId: 'something-else',
        categories: [],
        availableLinkIds: {},
      })
      const pagetype = vi
        .fn()
        .mockResolvedValue({ pageType: 'Product', id: 55 })
      const fetchProduct = vi.fn().mockResolvedValue(makeSearchProduct())
      const ctx = makeProductCtx({
        load,
        getLocalizedProduct,
        pagetype,
        fetchProduct,
        localizationEnabled: true,
        locale: 'pt-BR',
      })

      await callProduct(
        [
          { key: 'slug', value: 'camisa-azul-100' },
          { key: 'locale', value: 'pt-BR' },
        ],
        ctx
      )

      expect(pagetype).toHaveBeenCalledWith('camisa-azul-100/p')
    })

    it('falls back without checking Dataplane when localization is disabled', async () => {
      const load = vi
        .fn()
        .mockResolvedValue(makeSku({ linkText: 'blue-shirt' }))
      const getLocalizedProduct = vi.fn()
      const pagetype = vi
        .fn()
        .mockResolvedValue({ pageType: 'Product', id: 55 })
      const fetchProduct = vi.fn().mockResolvedValue(makeSearchProduct())
      const ctx = makeProductCtx({
        load,
        getLocalizedProduct,
        pagetype,
        fetchProduct,
        localizationEnabled: false,
      })

      await callProduct([{ key: 'slug', value: 'red-shirt-100' }], ctx)

      expect(getLocalizedProduct).not.toHaveBeenCalled()
      expect(pagetype).toHaveBeenCalledWith('red-shirt-100/p')
    })

    it('falls back without checking Dataplane when no locale facet is present', async () => {
      const load = vi
        .fn()
        .mockResolvedValue(makeSku({ linkText: 'blue-shirt' }))
      const getLocalizedProduct = vi.fn()
      const pagetype = vi
        .fn()
        .mockResolvedValue({ pageType: 'Product', id: 55 })
      const fetchProduct = vi.fn().mockResolvedValue(makeSearchProduct())
      const ctx = makeProductCtx({
        load,
        getLocalizedProduct,
        pagetype,
        fetchProduct,
        localizationEnabled: true,
      })

      await callProduct([{ key: 'slug', value: 'red-shirt-100' }], ctx)

      expect(getLocalizedProduct).not.toHaveBeenCalled()
      expect(pagetype).toHaveBeenCalled()
    })
  })

  describe('fallback to the legacy product route', () => {
    it('falls back when the sku is not found by id', async () => {
      // A slug facet must also be present: the fallback route needs a slug to
      // resolve through `pagetype`, and is a no-op (BadRequestError) without one.
      const load = vi.fn().mockRejectedValue(new NotFoundError('no sku'))
      const pagetype = vi
        .fn()
        .mockResolvedValue({ pageType: 'Product', id: 55 })
      const fetchProduct = vi.fn().mockResolvedValue(makeSearchProduct())
      const ctx = makeProductCtx({ load, pagetype, fetchProduct })

      const result = await callProduct(
        [
          { key: 'id', value: '999' },
          { key: 'slug', value: 'blue-shirt-999' },
        ],
        ctx
      )

      expect(pagetype).toHaveBeenCalledWith('blue-shirt-999/p')
      expect(fetchProduct).toHaveBeenCalledWith({ field: 'id', value: '55' })
      expect(result.isVariantOf).toMatchObject({ productId: 'prod1' })
      expect(result.itemId).toBe('55')
    })

    it('falls back when the slug has no numeric skuId suffix and there is no id facet', async () => {
      const load = vi.fn()
      const pagetype = vi
        .fn()
        .mockResolvedValue({ pageType: 'Product', id: 55 })
      const fetchProduct = vi.fn().mockResolvedValue(makeSearchProduct())
      const ctx = makeProductCtx({ load, pagetype, fetchProduct })

      await callProduct([{ key: 'slug', value: 'blue-shirt' }], ctx)

      expect(load).not.toHaveBeenCalled()
      expect(pagetype).toHaveBeenCalledWith('blue-shirt/p')
    })

    it('rejects with BadRequestError when neither id nor slug is provided at all', async () => {
      const ctx = makeProductCtx()

      await expect(callProduct([], ctx)).rejects.toThrow('Missing slug or id')
    })

    it('throws NotFoundError when pagetype does not resolve to a product', async () => {
      const load = vi.fn().mockRejectedValue(new NotFoundError('no sku'))
      const pagetype = vi.fn().mockResolvedValue({ pageType: 'Search' })
      const ctx = makeProductCtx({ load, pagetype })

      await expect(
        callProduct(
          [
            { key: 'id', value: '999' },
            { key: 'slug', value: 'blue-shirt-999' },
          ],
          ctx
        )
      ).rejects.toThrow(/No product found for slug/)
    })

    it('throws NotFoundError when Intelligent Search has no product for the resolved id', async () => {
      const load = vi.fn().mockRejectedValue(new NotFoundError('no sku'))
      const pagetype = vi
        .fn()
        .mockResolvedValue({ pageType: 'Product', id: 55 })
      const fetchProduct = vi.fn().mockRejectedValue(new Error('IS down'))
      const ctx = makeProductCtx({ load, pagetype, fetchProduct })

      await expect(
        callProduct(
          [
            { key: 'id', value: '999' },
            { key: 'slug', value: 'blue-shirt-999' },
          ],
          ctx
        )
      ).rejects.toThrow(/No product found for id 55/)
    })

    it('rethrows unrelated errors without falling back', async () => {
      const load = vi.fn().mockRejectedValue(new Error('boom'))
      const pagetype = vi.fn()
      const ctx = makeProductCtx({ load, pagetype })

      await expect(
        callProduct([{ key: 'id', value: '999' }], ctx)
      ).rejects.toThrow('boom')
      expect(pagetype).not.toHaveBeenCalled()
    })
  })
})

describe('Query.accountProfile', () => {
  const accountProfile = (Query as any).accountProfile

  const makeRepCtx = ({
    customerId = 'contract-1',
  }: { customerId?: string }) => {
    const getContractById = vi.fn()
    const getUserById = vi.fn()
    const sessionMock = vi.fn()

    const jwtPayload = Buffer.from(
      JSON.stringify({ userId: 'user-1', isRepresentative: true, customerId })
    ).toString('base64url')
    const token = `header.${jwtPayload}.signature`

    const ctx = {
      account: 'b2bfaststoredev',
      headers: { cookie: `VtexIdclientAutCookie_b2bfaststoredev=${token}` },
      clients: {
        commerce: {
          session: sessionMock,
          masterData: { getContractById },
          licenseManager: { getUserById },
        },
      },
    } as any

    return { ctx, getContractById, getUserById, sessionMock }
  }

  it('does not throw when the representative session is all-null and resolves the contract via jwt.customerId', async () => {
    const { ctx, getContractById, sessionMock } = makeRepCtx({
      customerId: 'contract-1',
    })
    sessionMock.mockResolvedValue({
      namespaces: { profile: null, authentication: null, shopper: null },
    })
    getContractById.mockResolvedValue({
      corporateName: 'BENAROYA RESEARCH COUPA',
    })

    const result = await accountProfile(null, null, ctx)

    expect(getContractById).toHaveBeenCalledWith({ contractId: 'contract-1' })
    expect(result).toEqual({
      name: 'BENAROYA RESEARCH COUPA',
      email: '',
      id: 'contract-1',
    })
  })

  it('does not throw and skips the CL lookup when no contract id is available anywhere', async () => {
    const { ctx, getContractById, sessionMock } = makeRepCtx({ customerId: '' })
    sessionMock.mockResolvedValue({
      namespaces: {
        profile: null,
        authentication: null,
        shopper: {
          firstName: { value: 'Joao' },
          lastName: { value: 'Caetano' },
        },
      },
    })

    const result = await accountProfile(null, null, ctx)

    expect(getContractById).not.toHaveBeenCalled()
    expect(result).toEqual({ name: 'Joao Caetano', email: '', id: '' })
  })

  it('does not fail the field when getContractById throws', async () => {
    const { ctx, getContractById, sessionMock } = makeRepCtx({
      customerId: 'contract-1',
    })
    sessionMock.mockResolvedValue({
      namespaces: {
        profile: null,
        authentication: { storeUserEmail: { value: 'rep@acme.com' } },
        shopper: {
          firstName: { value: 'Joao' },
          lastName: { value: 'Caetano' },
        },
      },
    })
    getContractById.mockRejectedValue(new Error('CL unavailable'))

    const result = await accountProfile(null, null, ctx)

    expect(getContractById).toHaveBeenCalledWith({ contractId: 'contract-1' })
    expect(result).toEqual({
      name: 'Joao Caetano',
      email: 'rep@acme.com',
      id: 'contract-1',
    })
  })

  it('uses the populated profile namespace when available', async () => {
    const { ctx, getContractById, sessionMock } = makeRepCtx({
      customerId: 'contract-1',
    })
    sessionMock.mockResolvedValue({
      namespaces: {
        profile: { id: { value: 'contract-1' }, email: { value: 'x@y.com' } },
        authentication: null,
        shopper: null,
      },
    })
    getContractById.mockResolvedValue({ corporateName: 'Corp X' })

    const result = await accountProfile(null, null, ctx)

    expect(getContractById).toHaveBeenCalledWith({ contractId: 'contract-1' })
    expect(result).toEqual({
      name: 'Corp X',
      email: 'x@y.com',
      id: 'contract-1',
    })
  })
})

