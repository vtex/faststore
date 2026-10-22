/**
 * Refresh routes, in the order they are tried.
 *
 * The Authenticator route keeps the B2B contract claims (`customerId`,
 * `unitId`, `isRepresentative`) set by `switch-properties` and writes the auth
 * cookie only on the request host. The legacy VTEX ID route drops those claims
 * and also writes the cookie on the parent domain, so it is only a fallback for
 * sessions whose `vid_rt` cookie is not scoped to the Authenticator path yet.
 *
 * `vid_rt` is scoped to these paths, so the browser never sends it anywhere
 * else.
 */
export const REFRESH_TOKEN_PATHS = [
  '/api/authenticator/v1/refreshtoken/webstore',
  '/api/vtexid/refreshtoken/webstore',
] as const
