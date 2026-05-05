import { shouldForceRefreshTokenForValidateSession } from '../../src/utils/validateSessionRefreshToken'

describe('shouldForceRefreshTokenForValidateSession', () => {
  const now = 1_700_000_000

  describe('when client has no refreshAfter yet', () => {
    it('returns true if JWT exists (access token still valid)', () => {
      expect(
        shouldForceRefreshTokenForValidateSession({
          jwt: { exp: now + 3600 },
          sessionRefreshAfter: undefined,
          nowSeconds: now,
        })
      ).toBe(true)
    })

    it('returns true if JWT exists (access token already expired)', () => {
      expect(
        shouldForceRefreshTokenForValidateSession({
          jwt: { exp: now - 60 },
          sessionRefreshAfter: null,
          nowSeconds: now,
        })
      ).toBe(true)
    })

    it('returns false if there is no JWT and no refreshAfter', () => {
      expect(
        shouldForceRefreshTokenForValidateSession({
          jwt: null,
          sessionRefreshAfter: undefined,
          nowSeconds: now,
        })
      ).toBe(false)
    })
  })

  describe('when session.refreshAfter is set', () => {
    it('returns false if refreshAfter is in the future', () => {
      expect(
        shouldForceRefreshTokenForValidateSession({
          jwt: { exp: now + 3600 },
          sessionRefreshAfter: String(now + 100),
          nowSeconds: now,
        })
      ).toBe(false)
    })

    it('returns true if refreshAfter is in the past', () => {
      expect(
        shouldForceRefreshTokenForValidateSession({
          jwt: { exp: now + 3600 },
          sessionRefreshAfter: String(now - 1),
          nowSeconds: now,
        })
      ).toBe(true)
    })

    it('returns true if refreshAfter is past even without JWT', () => {
      expect(
        shouldForceRefreshTokenForValidateSession({
          jwt: null,
          sessionRefreshAfter: String(now - 1),
          nowSeconds: now,
        })
      ).toBe(true)
    })
  })
})
