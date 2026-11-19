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

  it('decodes a base64url payload without padding', () => {
    // Chosen so the encoding has `-`, `_` and needs padding in plain base64.
    const payload = { sub: '?>>?~~~', n: 1 }
    const base64url = Buffer.from(JSON.stringify(payload)).toString('base64url')

    expect(base64url).toMatch(/[-_]/)
    expect(base64url.length % 4).not.toBe(0)
    expect(parseJwt(`header.${base64url}.signature`)).toEqual(payload)
  })

  it('decodes UTF-8 characters in the payload', () => {
    const payload = { name: 'João Ñandú 🛒', city: 'São Paulo' }
    const base64url = Buffer.from(JSON.stringify(payload)).toString('base64url')

    expect(parseJwt(`header.${base64url}.signature`)).toEqual(payload)
  })

  it('returns null instead of throwing for a malformed token', () => {
    expect(parseJwt('not-a-jwt')).toBeNull()
  })

  it('returns null instead of throwing when the payload segment is not valid base64/JSON', () => {
    expect(parseJwt('header.%%%not-base64%%%.signature')).toBeNull()
  })
})
