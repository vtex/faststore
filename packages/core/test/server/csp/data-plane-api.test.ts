import { afterEach, describe, expect, it } from 'vitest'

import {
  cspSettingsDefaults,
  cspSettingsTimeouts,
  cspSettingsUrl,
  DEFAULT_DATA_PLANE_ORIGIN,
  getDataPlaneOrigin,
} from '../../../src/server/csp/data-plane-api'

const ENV_KEYS = [
  'DATA_PLANE_API_URL',
  'CSP_SETTINGS_TTL_MS',
  'CSP_SETTINGS_STALE_MS',
  'CSP_SETTINGS_TIMEOUT_MS',
] as const

const originalEnv = Object.fromEntries(
  ENV_KEYS.map((key) => [key, process.env[key]])
)

afterEach(() => {
  for (const key of ENV_KEYS) {
    if (originalEnv[key] == null) {
      delete process.env[key]
    } else {
      process.env[key] = originalEnv[key]
    }
  }
})

describe('getDataPlaneOrigin', () => {
  it('defaults to the WebOps origin when DATA_PLANE_API_URL is unset', () => {
    delete process.env.DATA_PLANE_API_URL

    expect(DEFAULT_DATA_PLANE_ORIGIN).toBe('https://faststore.vtex.com')
    expect(getDataPlaneOrigin()).toBe(DEFAULT_DATA_PLANE_ORIGIN)
  })

  it.each(['', '   ', '/', '///'])('uses the default for %j', (value) => {
    process.env.DATA_PLANE_API_URL = value

    expect(getDataPlaneOrigin()).toBe(DEFAULT_DATA_PLANE_ORIGIN)
  })

  it('uses DATA_PLANE_API_URL with its scheme', () => {
    process.env.DATA_PLANE_API_URL = 'https://data-plane.example.com'

    expect(getDataPlaneOrigin()).toBe('https://data-plane.example.com')
  })

  it('prepends https:// when the scheme is missing', () => {
    process.env.DATA_PLANE_API_URL = 'data-plane.example.com'

    expect(getDataPlaneOrigin()).toBe('https://data-plane.example.com')
  })

  it('trims whitespace and trailing slashes', () => {
    process.env.DATA_PLANE_API_URL = '  https://data-plane.example.com///  '

    expect(getDataPlaneOrigin()).toBe('https://data-plane.example.com')
  })
})

describe('cspSettingsUrl', () => {
  it('builds the settings URL with the store id in the query string', () => {
    process.env.DATA_PLANE_API_URL = 'https://data-plane.example.com'

    const url = cspSettingsUrl('test-store')

    expect(url.origin).toBe('https://data-plane.example.com')
    expect(url.pathname).toBe('/api/v1/csp/settings')
    expect(url.searchParams.get('storeId')).toBe('test-store')
  })

  it('encodes the store id', () => {
    process.env.DATA_PLANE_API_URL = 'https://data-plane.example.com'

    expect(cspSettingsUrl('a&b=c').search).toBe('?storeId=a%26b%3Dc')
  })

  it('uses the default origin when DATA_PLANE_API_URL is unset', () => {
    delete process.env.DATA_PLANE_API_URL

    expect(cspSettingsUrl('test-store').href).toBe(
      'https://faststore.vtex.com/api/v1/csp/settings?storeId=test-store'
    )
  })
})

describe('cspSettingsTimeouts', () => {
  it('uses the spec defaults when env is unset', () => {
    delete process.env.CSP_SETTINGS_TTL_MS
    delete process.env.CSP_SETTINGS_STALE_MS
    delete process.env.CSP_SETTINGS_TIMEOUT_MS

    expect(cspSettingsTimeouts()).toEqual({
      ttlMs: 60_000,
      staleMs: 600_000,
      timeoutMs: 500,
    })
    expect(cspSettingsDefaults).toEqual(cspSettingsTimeouts())
  })

  it('reads overrides from env', () => {
    process.env.CSP_SETTINGS_TTL_MS = '1000'
    process.env.CSP_SETTINGS_STALE_MS = ' 2000 '
    process.env.CSP_SETTINGS_TIMEOUT_MS = '300'

    expect(cspSettingsTimeouts()).toEqual({
      ttlMs: 1000,
      staleMs: 2000,
      timeoutMs: 300,
    })
  })

  it('allows 0 for the TTL and the stale window', () => {
    process.env.CSP_SETTINGS_TTL_MS = '0'
    process.env.CSP_SETTINGS_STALE_MS = '0'

    expect(cspSettingsTimeouts()).toMatchObject({ ttlMs: 0, staleMs: 0 })
  })

  it.each(['abc', '-1', '1.5', '1e3', ''])(
    'falls back to the defaults for %j',
    (value) => {
      process.env.CSP_SETTINGS_TTL_MS = value
      process.env.CSP_SETTINGS_STALE_MS = value
      process.env.CSP_SETTINGS_TIMEOUT_MS = value

      expect(cspSettingsTimeouts()).toEqual(cspSettingsDefaults)
    }
  )

  it('falls back to the default timeout for 0', () => {
    process.env.CSP_SETTINGS_TIMEOUT_MS = '0'

    expect(cspSettingsTimeouts().timeoutMs).toBe(500)
  })
})
