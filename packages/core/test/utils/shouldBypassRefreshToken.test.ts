import { describe, expect, it } from 'vitest'
import {
  shouldBypassRefreshToken,
  shouldBypassRefreshTokenBrowser,
  shouldBypassRefreshTokenForRequest,
} from '../../src/utils/shouldBypassRefreshToken'

describe('shouldBypassRefreshToken', () => {
  it.each(['localhost', '127.0.0.1'])('returns true for "%s"', (hostname) => {
    expect(shouldBypassRefreshToken(hostname)).toBe(true)
  })

  it('returns true for a WebOps preview host', () => {
    expect(shouldBypassRefreshToken('brandless-abc123.preview.vtex.app')).toBe(
      true
    )
  })

  it('is case-insensitive for preview hosts', () => {
    expect(shouldBypassRefreshToken('Brandless-ABC123.Preview.VTEX.app')).toBe(
      true
    )
  })

  it('ignores the trailing dot of a fully qualified preview host', () => {
    expect(shouldBypassRefreshToken('brandless-abc123.preview.vtex.app.')).toBe(
      true
    )
  })

  it('returns false for the production "{account}.vtex.app" domain', () => {
    // `{account}.vtex.app` is a production default domain, not a preview.
    expect(shouldBypassRefreshToken('brandless.vtex.app')).toBe(false)
  })

  it('returns false for a custom store domain', () => {
    expect(shouldBypassRefreshToken('brandless.fast.store')).toBe(false)
  })

  it('returns false for hosts that only contain the preview suffix', () => {
    expect(shouldBypassRefreshToken('preview.vtex.app')).toBe(false)
    expect(shouldBypassRefreshToken('x.preview.vtex.app.evil.com')).toBe(false)
  })

  it('returns false for nullish or empty input', () => {
    expect(shouldBypassRefreshToken(null)).toBe(false)
    expect(shouldBypassRefreshToken(undefined)).toBe(false)
    expect(shouldBypassRefreshToken('')).toBe(false)
  })
})

describe('shouldBypassRefreshTokenForRequest', () => {
  it('returns true when the Host header is a local or preview host', () => {
    expect(shouldBypassRefreshTokenForRequest({ host: 'localhost:3000' })).toBe(
      true
    )
    expect(
      shouldBypassRefreshTokenForRequest({
        host: 'brandless-abc123.preview.vtex.app',
      })
    ).toBe(true)
  })

  it('returns true when the preview host arrives in x-forwarded-host', () => {
    // Behind the preview ingress, Host is an internal name.
    expect(
      shouldBypassRefreshTokenForRequest({
        host: 'faststore-internal:3000',
        'x-forwarded-host': 'brandless-abc123.preview.vtex.app',
      })
    ).toBe(true)
  })

  it('ignores a multi-value x-forwarded-host', () => {
    expect(
      shouldBypassRefreshTokenForRequest({
        host: 'brandless.fast.store',
        'x-forwarded-host': 'brandless-abc123.preview.vtex.app, proxy',
      })
    ).toBe(false)
  })

  it('returns false on production hosts', () => {
    expect(
      shouldBypassRefreshTokenForRequest({
        host: 'brandless.fast.store',
        'x-forwarded-host': 'brandless.fast.store',
      })
    ).toBe(false)
    expect(shouldBypassRefreshTokenForRequest({})).toBe(false)
  })
})

describe('shouldBypassRefreshTokenBrowser', () => {
  it('returns false when window is not available (SSR/Node)', () => {
    expect(shouldBypassRefreshTokenBrowser()).toBe(false)
  })
})
