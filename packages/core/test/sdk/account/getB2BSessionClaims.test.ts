import { describe, expect, it } from 'vitest'
import { getB2BSessionClaims } from '../../../src/sdk/account/getB2BSessionClaims'

const ACCOUNT = 'storeaccount'

const makeJwt = (payload: Record<string, unknown>) =>
  `header.${Buffer.from(JSON.stringify(payload)).toString('base64')}.signature`

describe('getB2BSessionClaims', () => {
  it('reads hasOrgAssociation and hasCustomerId from the token claims', () => {
    const cookie = `VtexIdclientAutCookie_${ACCOUNT}=${makeJwt({ unitId: 'unit-1', customerId: 'customer-1' })}`

    const result = getB2BSessionClaims({
      headers: { cookie },
      account: ACCOUNT,
    })

    expect(result).toEqual({ hasOrgAssociation: true, hasCustomerId: true })
  })

  it('returns false claims when the token has neither unitId nor customerId', () => {
    const cookie = `VtexIdclientAutCookie_${ACCOUNT}=${makeJwt({})}`

    const result = getB2BSessionClaims({
      headers: { cookie },
      account: ACCOUNT,
    })

    expect(result).toEqual({ hasOrgAssociation: false, hasCustomerId: false })
  })

  it('returns false claims (not a throw) when there is no auth cookie at all', () => {
    const result = getB2BSessionClaims({ headers: {}, account: ACCOUNT })

    expect(result).toEqual({ hasOrgAssociation: false, hasCustomerId: false })
  })

  it('does not throw when the auth cookie is malformed', () => {
    const cookie = `VtexIdclientAutCookie_${ACCOUNT}=not-a-jwt`

    const result = getB2BSessionClaims({
      headers: { cookie },
      account: ACCOUNT,
    })

    expect(result).toEqual({ hasOrgAssociation: false, hasCustomerId: false })
  })
})
