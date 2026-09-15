import { describe, expect, it, vi } from 'vitest'

import {
  ForbiddenError,
  UnauthorizedError,
  getAuthCookie,
  validateUserAuthentication,
} from '../../src'
import type { GraphqlContext } from '../../src'

/**
 * Regression tests for the runtime public entrypoint of `@faststore/api`.
 *
 * `validateUserAuthentication` and `getAuthCookie` are the helpers an API
 * extension needs to answer "is this request authenticated?" and "which token
 * do I forward to VTEX?". They used to be internal to
 * `platforms/vtex/utils/*`, so every store reimplemented them — and the
 * hand-written copies of `getAuthCookie` in particular tended to
 * `split('=')[1]`, truncating any token that contains `=`.
 *
 * These tests pin them to the entrypoint so the exports are not dropped by a
 * later refactor of the module layout.
 */

const contextWithAuthStatus = (authStatus: string | undefined) =>
  ({
    clients: {
      commerce: { vtexid: { validate: vi.fn(async () => ({ authStatus })) } },
    },
  }) as unknown as GraphqlContext

const contextThatRejects = (error: unknown) =>
  ({
    clients: {
      commerce: {
        vtexid: {
          validate: vi.fn(async () => {
            throw error
          }),
        },
      },
    },
  }) as unknown as GraphqlContext

describe('@faststore/api public runtime exports', () => {
  it('exports the auth helpers used by API extensions', () => {
    expect(typeof validateUserAuthentication).toBe('function')
    expect(typeof getAuthCookie).toBe('function')
  })

  describe('getAuthCookie', () => {
    it('reads the account auth cookie from a cookie header', () => {
      const cookies =
        'VtexIdclientAutCookie_other=nope; VtexIdclientAutCookie_storeframework=token'

      expect(getAuthCookie(cookies, 'storeframework')).toBe('token')
    })

    it('keeps `=` inside the token value', () => {
      const cookies = 'VtexIdclientAutCookie_storeframework=header.payload=='

      expect(getAuthCookie(cookies, 'storeframework')).toBe('header.payload==')
    })

    it('keeps the last value when the cookie key is duplicated', () => {
      const cookies =
        'VtexIdclientAutCookie_storeframework=stale; VtexIdclientAutCookie_storeframework=fresh'

      expect(getAuthCookie(cookies, 'storeframework')).toBe('fresh')
    })

    it('returns an empty string when the account has no auth cookie', () => {
      expect(getAuthCookie('someOtherCookie=value', 'storeframework')).toBe('')
      expect(getAuthCookie('', 'storeframework')).toBe('')
    })
  })

  describe('validateUserAuthentication', () => {
    it('resolves for a successful validation', async () => {
      await expect(
        validateUserAuthentication(contextWithAuthStatus('Success'))
      ).resolves.toBeUndefined()
    })

    it('throws UnauthorizedError when the session is not authenticated', async () => {
      await expect(
        validateUserAuthentication(contextWithAuthStatus('Unauthorized'))
      ).rejects.toBeInstanceOf(UnauthorizedError)
    })

    it('maps a 403 from VtexId to ForbiddenError', async () => {
      await expect(
        validateUserAuthentication(
          contextThatRejects({ extensions: { status: 403 } })
        )
      ).rejects.toBeInstanceOf(ForbiddenError)
    })
  })
})
