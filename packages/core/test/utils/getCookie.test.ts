import { describe, expect, it } from 'vitest'
import { parseJwt } from '../../src/utils/getCookie'

describe('parseJwt', () => {
  it('returns null for an empty token', () => {
    expect(parseJwt('')).toBeNull()
  })

  it('decodes a well-formed token payload', () => {
    const payload = { unitId: 'unit-1' }
    const token = `header.${Buffer.from(JSON.stringify(payload)).toString('base64')}.signature`

    expect(parseJwt(token)).toEqual(payload)
  })

  it('returns null instead of throwing for a malformed token', () => {
    expect(parseJwt('not-a-jwt')).toBeNull()
  })

  it('returns null instead of throwing when the payload segment is not valid base64/JSON', () => {
    expect(parseJwt('header.%%%not-base64%%%.signature')).toBeNull()
  })
})
