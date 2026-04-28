interface ShouldForceRefreshParams {
  jwt: { exp: number } | null | undefined
  sessionRefreshAfter: string | null | undefined
  /** Defaults to `Math.floor(Date.now() / 1000)` — pass explicitly in tests. */
  nowSeconds?: number
}

/**
 * Decides whether the GraphQL handler should force a token-refresh 401
 * for a ValidateSession request.
 *
 * Two independent triggers:
 *  1. JWT exists but the client has never received a refreshAfter
 *     → first refresh-token round-trip.
 *  2. refreshAfter is set and already in the past
 *     → scheduled retry window elapsed.
 */
export function shouldForceRefreshTokenForValidateSession({
  jwt,
  sessionRefreshAfter,
  nowSeconds = Math.floor(Date.now() / 1000),
}: ShouldForceRefreshParams): boolean {
  const refreshAfterExists = !!sessionRefreshAfter
  const firstRefreshRequest = !!jwt && !refreshAfterExists
  const refreshAfterExpired =
    refreshAfterExists && nowSeconds > Number(sessionRefreshAfter)

  return firstRefreshRequest || refreshAfterExpired
}
