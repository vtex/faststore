import type { Context } from '../../src/platforms/vtex'
import type { ContextForCookies } from '../../src/platforms/vtex/utils/cookies'
import {
  getAuthCookie,
  getStoreCookie,
  getUpdatedCookie,
  getWithCookie,
  updatesContextStorageCookies,
  updatesCookieValueByKey,
} from '../../src/platforms/vtex/utils/cookies'

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

describe('Cookie normalization (duplicate handling)', () => {
  it('Should handle duplicate cookies and keep the last value in getUpdatedCookie', () => {
    const cookieWithDuplicates =
      'VtexIdclientAutCookie_account=oldValue; vtex_session=sessionValue; VtexIdclientAutCookie_account=newValue'
    const ctx = {
      headers: { cookie: cookieWithDuplicates },
      storage: { cookies: new Map() },
    }

    const result = getUpdatedCookie(ctx)

    // Should keep the last value for duplicate keys, maintaining order of first appearance
    expect(result).toEqual(
      'VtexIdclientAutCookie_account=newValue; vtex_session=sessionValue'
    )
  })

  it('Should handle multiple duplicate cookies and keep the last values', () => {
    const cookieWithMultipleDuplicates =
      'key1=value1; key2=value2; key1=value1_updated; key3=value3; key2=value2_updated; key1=value1_final'
    const ctx = {
      headers: { cookie: cookieWithMultipleDuplicates },
      storage: { cookies: new Map() },
    }

    const result = getUpdatedCookie(ctx)

    // Should keep the last value for each duplicate key, maintaining order of first appearance
    expect(result).toEqual(
      'key1=value1_final; key2=value2_updated; key3=value3'
    )
  })

  it('Should handle duplicate auth cookies in getAuthCookie and return the last value', () => {
    const cookieWithDuplicateAuth =
      'VtexIdclientAutCookie_account=oldToken; other_cookie=value; VtexIdclientAutCookie_account=newToken'
    const account = 'account'

    const result = getAuthCookie(cookieWithDuplicateAuth, account)

    // Should return the last (newest) auth token
    expect(result).toEqual('newToken')
  })
})
