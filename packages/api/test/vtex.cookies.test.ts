import {
  getSetCookies,
  getStoreCookie,
  getUpdatedCookie,
  getWithCookie,
  updatesContextStorageCookies,
  updatesCookieValueByKey,
} from '../src/platforms/vtex/utils/cookies'
import { VtexCommerce } from '../src/platforms/vtex/clients/commerce'
import type { ContextForCookies } from '../src/platforms/vtex/utils/cookies'
import type { Context, Options } from '../src/platforms/vtex'

const mockedFetch = jest.fn()

jest.mock('../src/platforms/vtex/clients/fetch.ts', () => ({
  fetchAPI: async (info: RequestInfo, init?: RequestInit, options?: any) =>
    mockedFetch(info, init, options),
}))

const CHECKOUT_SET_COOKIE =
  'checkout.vtex.com=__ofid=f9295573872f45f9b0041f40ccc4e136; expires=Sat, 08 Jun 2024 20:12:41 GMT; domain=vtexfaststore.com; path=/; secure; samesite=lax; httponly'
const OWNERSHIP_SET_COOKIE =
  'CheckoutOrderFormOwnership=CFEUHpzya69CNICSrc4h5cJzeQE856pULms%2BxxQdF9EOh5WPwtrzqMwl9FwAhPVM; expires=Sat, 08 Jun 2024 20:12:41 GMT; domain=vtexfaststore.com; path=/; secure; samesite=strict; httponly'

const headersWith = (setCookies: string[]) =>
  (({
    getSetCookie: () => setCookies,
  } as unknown) as Headers)

beforeEach(() => {
  mockedFetch.mockReset()
})

describe('getUpdatedCookie', () => {
  it('Should return null if context has no headers', () => {
    const ctx = {} as ContextForCookies

    expect(getUpdatedCookie(ctx)).toEqual(null)
  })

  it('Should return null if context has no cookie header', () => {
    const ctx = { headers: {} } as ContextForCookies

    expect(getUpdatedCookie(ctx)).toEqual(null)
  })

  it('Should return original cookie headers if storage cookies are empty', () => {
    const cookie = 'key=value'
    const ctx = {
      headers: { cookie },
      storage: { cookies: new Map() },
    }

    expect(getUpdatedCookie(ctx)).toEqual(cookie)
  })

  it('Should send storage cookies even when the request had no cookie header', () => {
    const ctx = {
      headers: {},
      storage: {
        cookies: new Map(
          Object.entries({
            'checkout.vtex.com': { value: '__ofid=abc' },
            CheckoutOrderFormOwnership: { value: 'owner' },
          })
        ),
      },
    } as ContextForCookies

    expect(getUpdatedCookie(ctx)).toEqual(
      'checkout.vtex.com=__ofid=abc;CheckoutOrderFormOwnership=owner'
    )
  })

  it('Should replace cookies with the ones in storage', () => {
    const cookie = 'key1=value1; key2=value2; key3=value3'
    const cookieStorage = {
      key1: { value: 'alteredValue1' },
      key3: { value: 'alteredValue3' },
    }

    const ctx = {
      headers: { cookie },
      storage: { cookies: new Map(Object.entries(cookieStorage)) },
    }

    expect(getUpdatedCookie(ctx)).toEqual(
      'key1=alteredValue1; key2=value2; key3=alteredValue3'
    )
  })
})

describe('updatesCookieValueByKey', () => {
  it('Should replace cookie value if key matches existing cookie', () => {
    const cookie = 'key1=value1; key2=value2; key3=value3'

    expect(updatesCookieValueByKey(cookie, 'key1', 'alteredValue1')).toEqual(
      'key1=alteredValue1; key2=value2; key3=value3'
    )
  })

  it('Should add cookie to cookie list if key does not match any existing cookies', () => {
    const cookie = 'key1=value1; key2=value2; key3=value3'

    expect(updatesCookieValueByKey(cookie, 'key4', 'value4')).toEqual(
      'key1=value1; key2=value2; key3=value3;key4=value4'
    )
  })

  it('Should not match a cookie whose name only ends with the key', () => {
    const cookie = 'mycheckout.vtex.com=other; checkout.vtex.com=__ofid=old'

    expect(
      updatesCookieValueByKey(cookie, 'checkout.vtex.com', '__ofid=new')
    ).toEqual('mycheckout.vtex.com=other; checkout.vtex.com=__ofid=new')
  })

  it('Should treat dots in the key literally', () => {
    const cookie = 'checkoutXvtexXcom=other'

    expect(
      updatesCookieValueByKey(cookie, 'checkout.vtex.com', '__ofid=new')
    ).toEqual('checkoutXvtexXcom=other;checkout.vtex.com=__ofid=new')
  })
})

describe('getWithCookie', () => {
  it('Should return unaltered headers if cookie is null', () => {
    const withCookie = getWithCookie({} as ContextForCookies)
    const headers = { 'content-type': 'application/json' }

    expect(withCookie(headers)).toEqual(headers)
  })

  it('Should return headers with cookie if cookie is present', () => {
    const cookie = 'key=value'
    const ctx = {
      headers: { cookie },
      storage: { cookies: new Map() },
    }

    const withCookie = getWithCookie(ctx)
    const headers = { 'content-type': 'application/json' }

    expect(withCookie(headers)).toEqual({ ...headers, cookie })
  })
})

describe('updatesContextStorageCookies', () => {
  it('Should not change storage if cookie key is not found', () => {
    const ctx = {
      storage: { cookies: new Map() },
    } as Pick<Context, 'storage'>

    updatesContextStorageCookies(ctx, ';;;;')

    expect(ctx.storage.cookies.size).toEqual(0)
  })

  it('Should add cookie to storage if cookie key is found', () => {
    const ctx = {
      storage: { cookies: new Map() },
    } as Pick<Context, 'storage'>

    updatesContextStorageCookies(ctx, CHECKOUT_SET_COOKIE)

    expect(ctx.storage.cookies.get('checkout.vtex.com')).toEqual({
      value: '__ofid=f9295573872f45f9b0041f40ccc4e136',
      setCookie: CHECKOUT_SET_COOKIE,
    })
  })

  it('Should keep a single entry per cookie key', () => {
    const ctx = {
      storage: {
        cookies: new Map<string, Record<string, string>>([
          [
            'checkout.vtex.com',
            { value: '__ofid=old', setCookie: 'oldSetCookie' },
          ],
        ]),
      },
    } as Pick<Context, 'storage'>

    updatesContextStorageCookies(ctx, CHECKOUT_SET_COOKIE)

    expect(ctx.storage.cookies.size).toEqual(1)
    expect(ctx.storage.cookies.get('checkout.vtex.com')).toEqual({
      value: '__ofid=f9295573872f45f9b0041f40ccc4e136',
      setCookie: CHECKOUT_SET_COOKIE,
    })
  })
})

describe('getSetCookies', () => {
  it('Should use Headers.getSetCookie when available (Node >= 18)', () => {
    expect(
      getSetCookies(headersWith([CHECKOUT_SET_COOKIE, OWNERSHIP_SET_COOKIE]))
    ).toEqual([CHECKOUT_SET_COOKIE, OWNERSHIP_SET_COOKIE])
  })

  it('Should use raw() from node-fetch v2 (Node 16)', () => {
    const headers = ({
      raw: () => ({ 'set-cookie': [CHECKOUT_SET_COOKIE, OWNERSHIP_SET_COOKIE] }),
      get: () => `${CHECKOUT_SET_COOKIE}, ${OWNERSHIP_SET_COOKIE}`,
    } as unknown) as Headers

    expect(getSetCookies(headers)).toEqual([
      CHECKOUT_SET_COOKIE,
      OWNERSHIP_SET_COOKIE,
    ])
  })

  it('Should split a combined set-cookie header without breaking expires dates', () => {
    const headers = ({
      get: () => `${CHECKOUT_SET_COOKIE}, ${OWNERSHIP_SET_COOKIE}`,
    } as unknown) as Headers

    expect(getSetCookies(headers)).toEqual([
      CHECKOUT_SET_COOKIE,
      OWNERSHIP_SET_COOKIE,
    ])
  })

  it('Should return an empty list when there is no set-cookie', () => {
    const headers = ({ get: () => null } as unknown) as Headers

    expect(getSetCookies(headers)).toEqual([])
  })
})

describe('getStoreCookie', () => {
  it('Should store every set-cookie of the response', () => {
    const ctx = {
      storage: { cookies: new Map() },
    } as Pick<Context, 'storage'>

    getStoreCookie(ctx)(
      headersWith([CHECKOUT_SET_COOKIE, OWNERSHIP_SET_COOKIE])
    )

    expect(ctx.storage.cookies.size).toEqual(2)
    expect(ctx.storage.cookies.get('CheckoutOrderFormOwnership')).toEqual({
      value:
        'CFEUHpzya69CNICSrc4h5cJzeQE856pULms%2BxxQdF9EOh5WPwtrzqMwl9FwAhPVM',
      setCookie: OWNERSHIP_SET_COOKIE,
    })
  })
})

describe('VtexCommerce checkout cookies', () => {
  const options = {
    platform: 'vtex',
    account: 'storeframework',
    environment: 'vtexcommercestable',
    channel: '{"salesChannel":"1"}',
    locale: 'en-US',
    hideUnavailableItems: false,
  } as Options

  const createContext = (headers: Record<string, string>) =>
    (({
      headers,
      storage: {
        channel: { salesChannel: '1', regionId: '' },
        cookies: new Map(),
      },
    } as unknown) as Context)

  it('Should forward shopper cookies and forwarded host, and store Checkout cookies', async () => {
    const ctx = createContext({
      cookie: 'checkout.vtex.com=__ofid=abc; CheckoutOrderFormOwnership=old',
      'x-forwarded-host': 'www.store.com, proxy.internal',
      host: 'internal.host',
    })

    mockedFetch.mockImplementation(async (_info, _init, fetchOptions) => {
      fetchOptions.storeCookies(headersWith([OWNERSHIP_SET_COOKIE]))

      return { orderFormId: 'abc' }
    })

    const commerce = VtexCommerce(options, ctx)

    await commerce.checkout.orderForm({ id: 'abc' })
    await commerce.checkout.setCustomData({
      id: 'abc',
      appId: 'faststore',
      key: 'cartEtag',
      value: 'etag',
    })

    const [, firstInit] = mockedFetch.mock.calls[0]
    const [, secondInit] = mockedFetch.mock.calls[1]

    expect(firstInit.headers).toEqual({
      'content-type': 'application/json',
      'X-FORWARDED-HOST': 'store.com',
      cookie: 'checkout.vtex.com=__ofid=abc; CheckoutOrderFormOwnership=old',
    })

    // The second call already uses the ownership cookie Checkout set in the first one
    expect(secondInit.headers.cookie).toEqual(
      'checkout.vtex.com=__ofid=abc; CheckoutOrderFormOwnership=CFEUHpzya69CNICSrc4h5cJzeQE856pULms%2BxxQdF9EOh5WPwtrzqMwl9FwAhPVM'
    )
    expect(ctx.storage.cookies.get('CheckoutOrderFormOwnership')).toEqual({
      value:
        'CFEUHpzya69CNICSrc4h5cJzeQE856pULms%2BxxQdF9EOh5WPwtrzqMwl9FwAhPVM',
      setCookie: OWNERSHIP_SET_COOKIE,
    })
  })

  it('Should reuse cookies Checkout set earlier in the same request on a first visit', async () => {
    const ctx = createContext({ host: 'www.store.com' })

    mockedFetch.mockImplementationOnce(async (_info, _init, fetchOptions) => {
      fetchOptions.storeCookies(headersWith([OWNERSHIP_SET_COOKIE]))

      return {}
    })
    mockedFetch.mockResolvedValue({})

    const commerce = VtexCommerce(options, ctx)

    await commerce.checkout.shippingData({
      id: 'abc',
      body: { selectedAddresses: [] } as any,
    })
    await commerce.checkout.setCustomData({
      id: 'abc',
      appId: 'faststore',
      key: 'cartEtag',
      value: 'etag',
    })

    const [, firstInit] = mockedFetch.mock.calls[0]
    const [, secondInit] = mockedFetch.mock.calls[1]

    expect(firstInit.headers.cookie).toBeUndefined()
    expect(secondInit.headers.cookie).toEqual(
      'CheckoutOrderFormOwnership=CFEUHpzya69CNICSrc4h5cJzeQE856pULms%2BxxQdF9EOh5WPwtrzqMwl9FwAhPVM'
    )
  })

  it('Should fall back to the host header when there is no x-forwarded-host', async () => {
    const ctx = createContext({ host: 'www.store.com' })

    mockedFetch.mockResolvedValue({})

    await VtexCommerce(options, ctx).checkout.orderForm({ id: 'abc' })

    const [, init] = mockedFetch.mock.calls[0]

    expect(init.headers).toEqual({
      'content-type': 'application/json',
      'X-FORWARDED-HOST': 'store.com',
    })
  })

  it('Should not send shopper cookies to the simulation', async () => {
    const ctx = createContext({ cookie: 'checkout.vtex.com=__ofid=abc' })

    mockedFetch.mockResolvedValue({})

    await VtexCommerce(options, ctx).checkout.simulation({
      items: [],
    } as any)

    const [, init, fetchOptions] = mockedFetch.mock.calls[0]

    expect(init.headers).toEqual({ 'content-type': 'application/json' })
    expect(fetchOptions).toBeUndefined()
  })
})
