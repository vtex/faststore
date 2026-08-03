import { describe, expect, it } from 'vitest'
import { isLocalHost } from '../../src/utils/isLocalHost'

describe('isLocalHost', () => {
  it('returns true for "localhost"', () => {
    expect(isLocalHost('localhost')).toBe(true)
  })

  it('returns true for "127.0.0.1"', () => {
    expect(isLocalHost('127.0.0.1')).toBe(true)
  })

  it('is case-insensitive', () => {
    expect(isLocalHost('LOCALHOST')).toBe(true)
    expect(isLocalHost('Localhost')).toBe(true)
  })

  it('returns false for a production hostname', () => {
    expect(isLocalHost('brandless.fast.store')).toBe(false)
  })

  it('returns false for IPv6 loopback (not in the bypass list)', () => {
    // We intentionally bypass only the two canonical local hosts. IPv6
    // loopback (`::1`) and other loopback variants are out of scope.
    expect(isLocalHost('::1')).toBe(false)
  })

  it('returns false for inputs that still carry a port', () => {
    // Callers MUST normalize the hostname via getRequestHostname first.
    expect(isLocalHost('localhost:3000')).toBe(false)
  })

  it('returns false for null/undefined/empty input', () => {
    expect(isLocalHost(null)).toBe(false)
    expect(isLocalHost(undefined)).toBe(false)
    expect(isLocalHost('')).toBe(false)
  })
})
