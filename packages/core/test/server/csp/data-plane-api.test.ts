/// <reference types="next" />

import {
  CSP_SETTINGS_DEFAULTS,
  cspSettingsTimings,
  cspSettingsUrl,
  dataPlaneOrigin,
  DEFAULT_DATA_PLANE_ORIGIN,
} from '../../../src/server/csp/data-plane-api'

const ENV_KEYS = [
  'DATA_PLANE_API_URL',
  'CSP_SETTINGS_TTL_MS',
  'CSP_SETTINGS_STALE_MS',
  'CSP_SETTINGS_TIMEOUT_MS',
] as const

describe('data-plane-api', () => {
  const original: Record<string, string | undefined> = {}

  beforeAll(() => {
    for (const key of ENV_KEYS) {
      original[key] = process.env[key]
    }
  })

  beforeEach(() => {
    for (const key of ENV_KEYS) {
      delete process.env[key]
    }
  })

  afterAll(() => {
    for (const key of ENV_KEYS) {
      if (original[key] === undefined) {
        delete process.env[key]
      } else {
        process.env[key] = original[key]
      }
    }
  })

  describe('dataPlaneOrigin', () => {
    it('defaults to the WebOps origin when DATA_PLANE_API_URL is unset or blank', () => {
      expect(DEFAULT_DATA_PLANE_ORIGIN).toBe('https://faststore.vtex.com')
      expect(dataPlaneOrigin()).toBe(DEFAULT_DATA_PLANE_ORIGIN)

      process.env.DATA_PLANE_API_URL = '  '
      expect(dataPlaneOrigin()).toBe(DEFAULT_DATA_PLANE_ORIGIN)
    })

    it('trims trailing slashes and adds https:// when the scheme is missing', () => {
      process.env.DATA_PLANE_API_URL = 'data-plane.example.com//'
      expect(dataPlaneOrigin()).toBe('https://data-plane.example.com')

      process.env.DATA_PLANE_API_URL = 'http://localhost:4000/'
      expect(dataPlaneOrigin()).toBe('http://localhost:4000')
    })
  })

  describe('cspSettingsUrl', () => {
    it('builds the settings URL with the store id', () => {
      process.env.DATA_PLANE_API_URL = 'https://data-plane.example.com'

      expect(cspSettingsUrl('my store').href).toBe(
        'https://data-plane.example.com/api/v1/csp/settings?storeId=my+store'
      )
    })

    it('uses the default origin when DATA_PLANE_API_URL is not set', () => {
      expect(cspSettingsUrl('mystore').href).toBe(
        'https://faststore.vtex.com/api/v1/csp/settings?storeId=mystore'
      )
    })
  })

  describe('cspSettingsTimings', () => {
    it('uses the spec defaults', () => {
      expect(cspSettingsTimings()).toEqual({
        ttlMs: 60_000,
        staleMs: 600_000,
        timeoutMs: 500,
      })
      expect(cspSettingsTimings()).toEqual(CSP_SETTINGS_DEFAULTS)
    })

    it('reads values from env', () => {
      process.env.CSP_SETTINGS_TTL_MS = '30000'
      process.env.CSP_SETTINGS_STALE_MS = '0'
      process.env.CSP_SETTINGS_TIMEOUT_MS = ' 250 '

      expect(cspSettingsTimings()).toEqual({
        ttlMs: 30_000,
        staleMs: 0,
        timeoutMs: 250,
      })
    })

    it('falls back to the defaults for invalid values', () => {
      process.env.CSP_SETTINGS_TTL_MS = 'soon'
      process.env.CSP_SETTINGS_STALE_MS = '-1'
      process.env.CSP_SETTINGS_TIMEOUT_MS = '0'

      expect(cspSettingsTimings()).toEqual(CSP_SETTINGS_DEFAULTS)
    })
  })
})
