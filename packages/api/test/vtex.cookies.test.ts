import {
  getUpdatedCookie,
  updatesCookieValueByKey,
  getWithCookie,
  updatesContextStorageCookies,
  getStoreCookie,
} from '../src/platforms/vtex/utils/cookies'
import type { ContextForCookies } from '../src/platforms/vtex/utils/cookies'
import type { Context } from '../src/platforms/vtex'

describe('getUpdatedCookie', () => {
  it('Should return undefined if context has no headers', () => {
    const ctx = {} as ContextForCookies

    expect(getUpdatedCookie(ctx)).toEqual(null)
  })

  it('Should return undefined if context has no cookie header', () => {
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

  it('Should iterate on storage cookies and call updatesCookieValueByKey', () => {
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
    const key = 'key1'
    const value = 'alteredValue1'

    expect(updatesCookieValueByKey(cookie, key, value)).toEqual(
      'key1=alteredValue1; key2=value2; key3=value3'
    )
  })

  it('Should add cookie to cookie list if key does not match any existing cookies', () => {
    const cookie = 'key1=value1; key2=value2; key3=value3'
    const key = 'key4'
    const value = 'value4'

    expect(updatesCookieValueByKey(cookie, key, value)).toEqual(
      'key1=value1; key2=value2; key3=value3;key4=value4'
    )
  })
})

describe('getWithCookie', () => {
  it('Should return unaltered headers if cookie is null', () => {
    const withCookie = getWithCookie({} as ContextForCookies)
    const headers = { 'content-type': 'application/json' }

    const newHeaders = withCookie(headers)

    expect(newHeaders).toEqual(headers)
  })

  it('Should return headers with cookie if cookie is present', () => {
    const cookie = 'key=value'
    const ctx = {
      headers: { cookie },
      storage: { cookies: new Map() },
    }

    const withCookie = getWithCookie(ctx)
    const headers = { 'content-type': 'application/json' }

    const newHeaders = withCookie(headers)

    expect(newHeaders).toEqual({ ...headers, cookie: ctx.headers.cookie })
  })
})

describe('updatesContextStorageCookies', () => {
  it('Should not change storage if cookie key is not found', () => {
    const setCookie = 'malformedSetCookie;;;;'

    const ctx = {
      storage: { cookies: new Map() },
    } as Pick<Context, 'storage'>

    updatesContextStorageCookies(ctx, setCookie)

    expect(ctx.storage.cookies.entries()).toMatchObject({})
  })

  it('Should add cookie to storage if cookie key is found', () => {
    const setCookieKey = 'checkout.vtex.com'
    const setCookieValue = '__ofid=f9295573872f45f9b0041f40ccc4e136'
    const setCookie =
      'checkout.vtex.com=__ofid=f9295573872f45f9b0041f40ccc4e136; expires=Sat, 08 Jun 2024 20:12:41 GMT; domain=vtexfaststore.com; path=/; secure; samesite=lax; httponly'

    const ctx = {
      storage: { cookies: new Map() },
    } as Pick<Context, 'storage'>

    updatesContextStorageCookies(ctx, setCookie)

    expect(ctx.storage.cookies.get(setCookieKey)).toEqual({
      value: setCookieValue,
      setCookie: setCookie,
    })
  })

  it('Should change cookie from storage if cookie key is found and it is already in storage', () => {
    const setCookieKey = 'checkout.vtex.com'
    const setCookieValue = '__ofid=f9295573872f45f9b0041f40ccc4e136'
    const setCookie =
      'checkout.vtex.com=__ofid=f9295573872f45f9b0041f40ccc4e136; expires=Sat, 08 Jun 2024 20:12:41 GMT; domain=vtexfaststore.com; path=/; secure; samesite=lax; httponly'

    const cookieStorage = {
      'checkout.vtex.com': { value: setCookieValue, setCookie: 'oldSetCookie' },
    }

    const ctx = {
      storage: {
        cookies: new Map<string, Record<string, string>>(
          Object.entries(cookieStorage)
        ),
      },
    } as Pick<Context, 'storage'>

    updatesContextStorageCookies(ctx, setCookie)

    expect(ctx.storage.cookies.get(setCookieKey)).toEqual({
      value: setCookieValue,
      setCookie: setCookie,
    })
  })
})

describe('getStoreCookie', () => {
  it('Should iterate on headers and call updatesContextStorageCookies for each of them', () => {
    const ctx = {
      storage: { cookies: new Map() },
    } as Pick<Context, 'storage'>

    const headers = new Headers()
    headers.append(
      'set-cookie',
      'checkout.vtex.com=__ofid=f9295573872f45f9b0041f40ccc4e136; expires=Sat, 08 Jun 2024 20:12:41 GMT; domain=vtexfaststore.com; path=/; secure; samesite=lax; httponly'
    )
    headers.append(
      'set-cookie',
      'CheckoutOrderFormOwnership=CFEUHpzya69CNICSrc4h5cJzeQE856pULms%2BxxQdF9EOh5WPwtrzqMwl9FwAhPVM; expires=Sat, 08 Jun 2024 20:12:41 GMT; domain=vtexfaststore.com; path=/; secure; samesite=strict; httponly'
    )

    const storeCookies = getStoreCookie(ctx)

    storeCookies(headers)

    expect(ctx.storage.cookies.get('checkout.vtex.com')).toEqual({
      value: '__ofid=f9295573872f45f9b0041f40ccc4e136',
      setCookie:
        'checkout.vtex.com=__ofid=f9295573872f45f9b0041f40ccc4e136; expires=Sat, 08 Jun 2024 20:12:41 GMT; domain=vtexfaststore.com; path=/; secure; samesite=lax; httponly',
    })
    expect(ctx.storage.cookies.get('CheckoutOrderFormOwnership')).toEqual({
      value:
        'CFEUHpzya69CNICSrc4h5cJzeQE856pULms%2BxxQdF9EOh5WPwtrzqMwl9FwAhPVM',
      setCookie:
        'CheckoutOrderFormOwnership=CFEUHpzya69CNICSrc4h5cJzeQE856pULms%2BxxQdF9EOh5WPwtrzqMwl9FwAhPVM; expires=Sat, 08 Jun 2024 20:12:41 GMT; domain=vtexfaststore.com; path=/; secure; samesite=strict; httponly',
    })
    expect(ctx.storage.cookies.size).toEqual(2)
  })
})
