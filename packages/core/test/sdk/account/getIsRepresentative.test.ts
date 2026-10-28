import { describe, expect, it } from 'vitest'
import { getIsRepresentative } from '../../../src/sdk/account/getIsRepresentative'

const ACCOUNT = 'storeaccount'

const makeJwt = (payload: Record<string, unknown>) =>
  `header.${Buffer.from(JSON.stringify(payload)).toString('base64')}.signature`

const withToken = (payload: Record<string, unknown>) => ({
  headers: { cookie: `VtexIdclientAutCookie_${ACCOUNT}=${makeJwt(payload)}` },
  account: ACCOUNT,
})

describe('getIsRepresentative', () => {
  it('is true when the token has a unit and a contract', () => {
    expect(
      getIsRepresentative(
        withToken({ unitId: 'unit-1', customerId: 'contract-1' })
      )
    ).toBe(true)
  })

  it('does not depend on the isRepresentative claim', () => {
    expect(
      getIsRepresentative(
        withToken({
          unitId: 'unit-1',
          customerId: 'contract-1',
          isRepresentative: false,
        })
      )
    ).toBe(true)
    expect(getIsRepresentative(withToken({ isRepresentative: true }))).toBe(
      false
    )
  })

  it.each([
    ['without a unit', { customerId: 'contract-1' }],
    ['without a contract', { unitId: 'unit-1' }],
    ['with blank claims', { unitId: ' ', customerId: '' }],
    ['with non-string claims', { unitId: 1, customerId: true }],
  ])('is false %s', (_label, payload) => {
    expect(getIsRepresentative(withToken(payload))).toBe(false)
  })

  it('is false without an auth cookie or with a malformed one', () => {
    expect(getIsRepresentative({ headers: {}, account: ACCOUNT })).toBe(false)
    expect(
      getIsRepresentative({
        headers: { cookie: `VtexIdclientAutCookie_${ACCOUNT}=not-a-jwt` },
        account: ACCOUNT,
      })
    ).toBe(false)
  })
})
