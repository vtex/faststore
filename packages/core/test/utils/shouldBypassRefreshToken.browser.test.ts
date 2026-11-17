import { afterEach, describe, expect, it } from 'vitest'
import { shouldBypassRefreshTokenBrowser } from '../../src/utils/shouldBypassRefreshToken'

const originalLocation = window.location

function stubHostname(hostname: string) {
  // jsdom forbids assigning to `window.location` directly, so we redefine the
  // descriptor with a minimal stub that exposes the hostname we want to test.
  Object.defineProperty(window, 'location', {
    configurable: true,
    value: { ...originalLocation, hostname },
  })
}

describe('shouldBypassRefreshTokenBrowser', () => {
  afterEach(() => {
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: originalLocation,
    })
  })

  it.each(['localhost', '127.0.0.1', 'brandless-abc123.preview.vtex.app'])(
    'returns true when window.location.hostname is "%s"',
    (hostname) => {
      stubHostname(hostname)
      expect(shouldBypassRefreshTokenBrowser()).toBe(true)
    }
  )

  it.each(['brandless.vtex.app', 'brandless.fast.store'])(
    'returns false for the production hostname "%s"',
    (hostname) => {
      stubHostname(hostname)
      expect(shouldBypassRefreshTokenBrowser()).toBe(false)
    }
  )
})
