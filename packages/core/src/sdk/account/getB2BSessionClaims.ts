import { parse } from 'cookie'
import { parseJwt } from 'src/utils/getCookie'

type GetB2BSessionClaimsParams = {
  headers?: Record<string, string>
  account: string
}

export type B2BSessionClaims = {
  /**
   * Whether the buyer is associated with a Unit/Contract. Per the original
   * Personal Cards PRD (REQ-2), this is detected by the presence of a
   * `unitId` claim in the VTEX ID JWT — the same cookie `getIsRepresentative`
   * already decodes.
   */
  hasOrgAssociation: boolean
  /**
   * Whether the buyer holds the `useAdHocCard` platform permission, which
   * gates the Cards route for Unit/Contract-affiliated buyers (spec US-4).
   *
   * NOTE: this permission's exact surfacing in the FastStore session/JWT is
   * unconfirmed — see specs/my-account-cards.md ("Risks & Mitigations").
   * Defaults to `true` (ungated) whenever the claim isn't present as an
   * explicit boolean, so this delivery never wrongly blocks a buyer on a
   * contract we haven't verified yet. Revisit once confirmed.
   */
  hasAdHocCardAccess: boolean
}

export function getB2BSessionClaims({
  headers,
  account,
}: GetB2BSessionClaimsParams): B2BSessionClaims {
  const authCookie = parse(headers?.cookie ?? '')?.[
    'VtexIdclientAutCookie_' + account
  ]
  const jwt = parseJwt(authCookie)

  const hasOrgAssociation = !!jwt?.unitId
  const hasAdHocCardAccess =
    typeof jwt?.useAdHocCard === 'boolean' ? jwt.useAdHocCard : true

  return { hasOrgAssociation, hasAdHocCardAccess }
}
