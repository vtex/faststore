import { afterEach, describe, expect, it } from 'vitest'
import { isLocalHostBrowser } from '../../src/utils/isLocalHost'

const originalLocation = window.location

function stubHostname(hostname: string) {
  // jsdom forbids assigning to `window.location` directly, so we redefine the
  // descriptor with a minimal stub that exposes the hostname we want to test.
  Object.defineProperty(window, 'location', {
    configurable: true,
    value: { ...originalLocation, hostname },
  })
}

describe('isLocalHostBrowser', () => {
  afterEach(() => {
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: originalLocation,
    })
  })

  it('returns true when window.location.hostname is "localhost"', () => {
    stubHostname('localhost')
    expect(isLocalHostBrowser()).toBe(true)
  })

  it('returns true when window.location.hostname is "127.0.0.1"', () => {
    stubHostname('127.0.0.1')
    expect(isLocalHostBrowser()).toBe(true)
  })

  it('returns false for a production hostname', () => {
    stubHostname('brandless.fast.store')
    expect(isLocalHostBrowser()).toBe(false)
  })
})
