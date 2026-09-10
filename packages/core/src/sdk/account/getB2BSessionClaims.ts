import { parse } from 'cookie'
import { parseJwt } from 'src/utils/getCookie'

type GetB2BSessionClaimsParams = {
  headers?: Record<string, string>
  account: string
}

export type B2BSessionClaims = {
  /**
   * Whether the buyer is associated with a Unit/Contract. Per the Personal
   * Cards PRD (REQ-2), this is detected by the presence of a `unitId` claim in
   * the VTEX ID JWT — the same cookie `getIsRepresentative` already decodes.
   * Gates the Shared tab (FR-5).
   *
   * Note this is the only part of the gate that lives in the token. The
   * `useAdHocCard` permission is a License Manager resource key resolved from
   * the user's roles, so it is fetched server-side via the
   * `hasAdHocCardAccess` GraphQL query — not read from here.
   */
  hasOrgAssociation: boolean
  /**
   * Whether the buyer has an individual `customerId` claim, distinct from the
   * `unitId`/contract association. Combined with `hasAdHocCardAccess`, gates
   * the Personal tab (spec my-account-cards-gating-plan, the rectified model —
   * `useAdHocCard` alone doesn't gate the whole Cards route, only Personal-tab
   * visibility).
   */
  hasCustomerId: boolean
}

export function getB2BSessionClaims({
  headers,
  account,
}: GetB2BSessionClaimsParams): B2BSessionClaims {
  const authCookie = parse(headers?.cookie ?? '')?.[
    'VtexIdclientAutCookie_' + account
  ]
  const jwt = parseJwt(authCookie)

  return { hasOrgAssociation: !!jwt?.unitId, hasCustomerId: !!jwt?.customerId }
}
