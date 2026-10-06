import { describe, expect, it } from 'vitest'

import {
  singleForwardedHost,
  isHostAllowed,
} from '../../src/utils/trustedForwardedHost'

const ALLOW_LIST = ['localhost', '.vtex.app', '.localhost']

describe('isHostAllowed', () => {
  it.each([
    'localhost',
    'store.vtex.app',
    'sfj-1--acc.preview.vtex.app',
    'a.localhost',
  ])('allows %s', (host) => {
    expect(isHostAllowed(host, ALLOW_LIST)).toBe(true)
  })

  it.each([
    'evil-localhost',
    'notlocalhost',
    'evil-vtex.app',
    'vtex.app.evil.com',
    'evil.com',
  ])('rejects %s', (host) => {
    expect(isHostAllowed(host, ALLOW_LIST)).toBe(false)
  })
})

describe('isHostAllowed normalization', () => {
  it('is case-insensitive', () => {
    expect(isHostAllowed('Store.VTEX.app', ALLOW_LIST)).toBe(true)
    expect(isHostAllowed('LOCALHOST', ALLOW_LIST)).toBe(true)
  })

  it.each([
    'x;max-age=0;y.vtex.app',
    'a b.vtex.app',
    'x"y.vtex.app',
    'x=y.vtex.app',
    'x,y.vtex.app',
  ])('rejects %s, which would inject cookie attributes', (host) => {
    expect(isHostAllowed(host, ALLOW_LIST)).toBe(false)
  })

  it('accepts punycode hostnames', () => {
    expect(isHostAllowed('xn--lja-bma.vtex.app', ALLOW_LIST)).toBe(true)
  })

  it('expects a hostname: a port is not stripped here', () => {
    expect(isHostAllowed('store.vtex.app:8080', ALLOW_LIST)).toBe(false)
    expect(isHostAllowed('evil.com:vtex.app', ALLOW_LIST)).toBe(false)
  })
})

describe('singleForwardedHost', () => {
  it('returns the value when there is exactly one', () => {
    expect(singleForwardedHost('a.vtex.app')).toBe('a.vtex.app')
    expect(singleForwardedHost(' a.vtex.app ')).toBe('a.vtex.app')
    expect(singleForwardedHost(['a.vtex.app'])).toBe('a.vtex.app')
  })

  it('returns undefined when missing or empty', () => {
    expect(singleForwardedHost(undefined)).toBeUndefined()
    expect(singleForwardedHost('')).toBeUndefined()
    expect(singleForwardedHost([])).toBeUndefined()
  })

  it('ignores multi-value headers instead of picking one', () => {
    expect(singleForwardedHost('a.vtex.app, evil.com')).toBeUndefined()
    expect(singleForwardedHost('evil.com, a.vtex.app')).toBeUndefined()
    expect(singleForwardedHost(['a.vtex.app', 'evil.com'])).toBeUndefined()
  })
})
