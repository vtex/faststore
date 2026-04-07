const MILLISECONDS_PER_SECOND = 1000
const FIRST_REFRESH_IAT_WINDOW_SEC = 5 * 60
/** Grace before treating a Unix `exp` as expired (mitigates client/server clock skew). */
export const SESSION_REFRESH_EXPIRY_GRACE_SEC = 60

export type JwtPayload = {
  exp?: number
  iat?: number
} | null

/**
 * Whether a Unix timestamp (seconds) should be treated as expired for session refresh decisions.
 * Uses a grace window so refresh triggers slightly before strict wall-clock expiry.
 */
export function isExpiredForSessionRefresh(exp: number): boolean {
  const now = Math.floor(Date.now() / MILLISECONDS_PER_SECOND)
  return now + SESSION_REFRESH_EXPIRY_GRACE_SEC > exp
}

/**
 * True only for a short window after login when `refreshAfter` is not yet in session storage.
 */
export function isJwtEligibleForFirstRefreshTokenRequest(
  jwt: JwtPayload,
  refreshAfterExist: boolean
): boolean {
  if (!jwt || refreshAfterExist) {
    return false
  }
  const iat = jwt.iat
  if (iat == null) {
    return false
  }
  const now = Math.floor(Date.now() / MILLISECONDS_PER_SECOND)
  return now - iat < FIRST_REFRESH_IAT_WINDOW_SEC
}

export function computeShouldRefreshToken(params: {
  jwt: JwtPayload
  refreshAfter: string | null | undefined
}): boolean {
  const { jwt, refreshAfter } = params
  const refreshAfterExist = !!refreshAfter

  const tokenExpired = Boolean(
    jwt && isExpiredForSessionRefresh(Number(jwt.exp))
  )

  const refreshAfterExpired =
    refreshAfterExist && isExpiredForSessionRefresh(Number(refreshAfter))

  const tokenExistAndIsFirstRefreshTokenRequest =
    isJwtEligibleForFirstRefreshTokenRequest(jwt, refreshAfterExist)

  const tokenNotExistAndRefreshAfterExistAndIsExpired =
    !jwt && !!refreshAfterExist && refreshAfterExpired

  const tokenExpiredWithJwtPresent = Boolean(jwt && tokenExpired)

  return (
    tokenExistAndIsFirstRefreshTokenRequest ||
    tokenNotExistAndRefreshAfterExistAndIsExpired ||
    tokenExpiredWithJwtPresent
  )
}

export function describeShouldRefreshTokenReason(params: {
  jwt: JwtPayload
  refreshAfter: string | null | undefined
}):
  | 'first_refresh_window'
  | 'jwt_missing_refresh_after_expired'
  | 'jwt_expired'
  | null {
  if (!computeShouldRefreshToken(params)) {
    return null
  }
  const { jwt, refreshAfter } = params
  const refreshAfterExist = !!refreshAfter
  const tokenExpired = Boolean(
    jwt && isExpiredForSessionRefresh(Number(jwt?.exp))
  )
  const refreshAfterExpired =
    refreshAfterExist && isExpiredForSessionRefresh(Number(refreshAfter))

  if (isJwtEligibleForFirstRefreshTokenRequest(jwt, refreshAfterExist)) {
    return 'first_refresh_window'
  }
  if (!jwt && !!refreshAfterExist && refreshAfterExpired) {
    return 'jwt_missing_refresh_after_expired'
  }
  if (jwt && tokenExpired) {
    return 'jwt_expired'
  }
  return null
}
