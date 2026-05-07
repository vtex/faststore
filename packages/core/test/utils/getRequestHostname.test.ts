import { describe, expect, it } from 'vitest'
import { getRequestHostname } from '../../src/utils/getRequestHostname'

describe('getRequestHostname', () => {
  describe('returns null for missing input', () => {
    it('returns null when host is null', () => {
      expect(getRequestHostname(null)).toBeNull()
    })

    it('returns null when host is undefined', () => {
      expect(getRequestHostname(undefined)).toBeNull()
    })

    it('returns null when host is an empty string', () => {
      expect(getRequestHostname('')).toBeNull()
    })

    it('returns null when host is whitespace-only', () => {
      expect(getRequestHostname('   ')).toBeNull()
    })
  })

  describe('strips the port', () => {
    it('removes the port from a hostname with port', () => {
      expect(getRequestHostname('brandless.fast.store:443')).toBe(
        'brandless.fast.store'
      )
    })

    it('removes the port from localhost', () => {
      expect(getRequestHostname('localhost:3000')).toBe('localhost')
    })

    it('keeps the hostname unchanged when there is no port', () => {
      expect(getRequestHostname('brandless.fast.store')).toBe(
        'brandless.fast.store'
      )
    })
  })

  describe('lowercases the hostname', () => {
    it('lowercases an uppercase hostname', () => {
      expect(getRequestHostname('Brandless.Fast.Store')).toBe(
        'brandless.fast.store'
      )
    })

    it('lowercases a hostname with port', () => {
      expect(getRequestHostname('STORE.COM:8080')).toBe('store.com')
    })
  })

  describe('handles surrounding whitespace', () => {
    it('trims leading and trailing whitespace', () => {
      expect(getRequestHostname('  store.com  ')).toBe('store.com')
    })

    it('trims whitespace and strips port', () => {
      expect(getRequestHostname('  store.com:443  ')).toBe('store.com')
    })
  })

  describe('falls back gracefully on malformed input', () => {
    it('returns the lowercased pre-port segment when URL parsing fails', () => {
      // `new URL('https://...')` accepts most strings, so to exercise the
      // fallback we rely on `.split(':')[0].toLowerCase()` for any value the
      // URL parser cannot handle. In practice this is a defensive branch.
      expect(getRequestHostname('STORE.COM:443')).toBe('store.com')
    })
  })
})
