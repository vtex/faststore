/**
 * VTEX ID refresh route. The recommended route for every non-B2B session.
 * For B2B it drops the contract claims set by `switch-properties` and also
 * writes the auth cookie on the parent domain.
 */
export const LEGACY_REFRESH_TOKEN_PATH = '/api/vtexid/refreshtoken/webstore'

/**
 * Authenticator refresh route, recommended for the B2B flow only. It keeps the
 * contract claims (`customerId`, `unitId`, `isRepresentative`) and writes the
 * auth cookie only on the request host.
 */
export const AUTHENTICATOR_REFRESH_TOKEN_PATH =
  '/api/authenticator/v1/refreshtoken/webstore'

/**
 * Every path `vid_rt` can be scoped to. VTEX ID writes it only on the legacy
 * path; Authenticator writes it on all three. The browser only sends it to
 * these paths, so it never reaches any other route.
 */
export const VID_RT_PATHS = [
  LEGACY_REFRESH_TOKEN_PATH,
  '/api/authenticator/refreshtoken/webstore',
  AUTHENTICATOR_REFRESH_TOKEN_PATH,
] as const
