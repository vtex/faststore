import {
  SESSION_REFRESH_EXPIRY_GRACE_SEC,
  computeShouldRefreshToken,
  isExpiredForSessionRefresh,
  isJwtEligibleForFirstRefreshTokenRequest,
} from '../../src/utils/sessionValidateRefreshDecision'

describe('sessionValidateRefreshDecision', () => {
  const nowSec = 1_700_000_000

  beforeEach(() => {
    jest.useFakeTimers()
    jest.setSystemTime(new Date(nowSec * 1000))
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  describe('isExpiredForSessionRefresh', () => {
    it('returns false when exp is more than grace seconds ahead', () => {
      expect(
        isExpiredForSessionRefresh(
          nowSec + SESSION_REFRESH_EXPIRY_GRACE_SEC + 1
        )
      ).toBe(false)
    })

    it('returns true when exp is inside the grace window (strictly before now+grace)', () => {
      expect(
        isExpiredForSessionRefresh(
          nowSec + SESSION_REFRESH_EXPIRY_GRACE_SEC - 1
        )
      ).toBe(true)
    })

    it('returns true when exp is in the past', () => {
      expect(isExpiredForSessionRefresh(nowSec - 1)).toBe(true)
    })
  })

  describe('isJwtEligibleForFirstRefreshTokenRequest', () => {
    it('is false when refreshAfter exists', () => {
      expect(
        isJwtEligibleForFirstRefreshTokenRequest(
          { iat: nowSec - 60, exp: nowSec + 3600 },
          true
        )
      ).toBe(false)
    })

    it('is false when jwt is null', () => {
      expect(isJwtEligibleForFirstRefreshTokenRequest(null, false)).toBe(false)
    })

    it('is false when iat is older than 5 minutes', () => {
      expect(
        isJwtEligibleForFirstRefreshTokenRequest(
          { iat: nowSec - 6 * 60, exp: nowSec + 3600 },
          false
        )
      ).toBe(false)
    })

    it('is true when iat is within 5 minutes and no refreshAfter', () => {
      expect(
        isJwtEligibleForFirstRefreshTokenRequest(
          { iat: nowSec - 60, exp: nowSec + 3600 },
          false
        )
      ).toBe(true)
    })
  })

  describe('computeShouldRefreshToken', () => {
    it('is true for first-login window (jwt, no refreshAfter, fresh iat)', () => {
      expect(
        computeShouldRefreshToken({
          jwt: { iat: nowSec - 30, exp: nowSec + 10_000 },
          refreshAfter: null,
        })
      ).toBe(true)
    })

    it('is false when jwt exists, no refreshAfter, but iat is stale', () => {
      expect(
        computeShouldRefreshToken({
          jwt: { iat: nowSec - 400, exp: nowSec + 10_000 },
          refreshAfter: null,
        })
      ).toBe(false)
    })

    it('is true when jwt is missing, refreshAfter exists and is expired', () => {
      expect(
        computeShouldRefreshToken({
          jwt: null,
          refreshAfter: String(nowSec - 100),
        })
      ).toBe(true)
    })

    it('is false when jwt is missing, refreshAfter exists and is still valid', () => {
      expect(
        computeShouldRefreshToken({
          jwt: null,
          refreshAfter: String(nowSec + 10_000),
        })
      ).toBe(false)
    })

    it('is true when jwt exists and access token exp is expired (regardless of refreshAfter validity)', () => {
      expect(
        computeShouldRefreshToken({
          jwt: { iat: nowSec - 10_000, exp: nowSec - 100 },
          refreshAfter: String(nowSec + 50_000),
        })
      ).toBe(true)
    })

    it('is false when jwt valid and refreshAfter valid', () => {
      expect(
        computeShouldRefreshToken({
          jwt: { iat: nowSec - 10_000, exp: nowSec + 10_000 },
          refreshAfter: String(nowSec + 50_000),
        })
      ).toBe(false)
    })
  })
})
