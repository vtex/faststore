import { describe, expect, it } from 'vitest'

import {
  firstForwardedHost,
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

describe('firstForwardedHost', () => {
  it('returns undefined when missing or empty', () => {
    expect(firstForwardedHost(undefined)).toBeUndefined()
    expect(firstForwardedHost('')).toBeUndefined()
    expect(firstForwardedHost(' , a.vtex.app')).toBeUndefined()
  })

  it('returns the first value of a comma-joined header', () => {
    expect(firstForwardedHost('a.vtex.app, evil.com')).toBe('a.vtex.app')
  })

  it('returns the first entry of an array', () => {
    expect(firstForwardedHost(['a.vtex.app', 'evil.com'])).toBe('a.vtex.app')
  })
})
