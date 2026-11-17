import { parse } from 'cookie'
import { parseJwt } from 'src/utils/getCookie'

type GetIsB2BBuyerParams = {
  headers?: Record<string, string>
  account: string
}

/**
 * Whether the buyer is a B2B member: the VTEX ID token carries both an
 * organizational unit and a contract, the rule Buyer Portal uses. The
 * `isRepresentative` claim is not read, since it can be true outside B2B.
 */
export function getIsB2BBuyer({
  headers,
  account,
}: GetIsB2BBuyerParams): boolean {
  const authCookie = parse(headers?.cookie ?? '')?.[
    'VtexIdclientAutCookie_' + account
  ]
  const jwt = parseJwt(authCookie)

  return isNonBlankString(jwt?.unitId) && isNonBlankString(jwt?.customerId)
}

function isNonBlankString(value: unknown): boolean {
  return typeof value === 'string' && value.trim() !== ''
}
