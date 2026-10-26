import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const mockFetch = vi.hoisted(() => vi.fn())

vi.mock('isomorphic-unfetch', () => ({ __esModule: true, default: mockFetch }))

vi.mock('src/sdk/localization/useLocalizationConfig', () => ({
  getStoreURL: () => 'https://b2bfaststore.vtexfaststore.com',
}))

vi.mock('src/utils/utilities', () => ({
  sanitizeHost: (origin: string) => origin.replace(/^https?:\/\//, ''),
}))

import {
  REFRESH_AFTER_FALLBACK_SECONDS,
  getNextRefreshAfter,
  getRefreshAfterSeconds,
  isB2BSession,
  isRefreshTokenSuccessful,
  refreshTokenRequest,
} from '../../../src/sdk/account/refreshToken'

const AUTHENTICATOR_URL =
  'https://b2bfaststore.vtexfaststore.com/api/authenticator/v1/refreshtoken/webstore'
const LEGACY_URL =
  'https://b2bfaststore.vtexfaststore.com/api/vtexid/refreshtoken/webstore'

const authenticatorSuccess = {
  authStatus: 'Success',
  refreshAfter: 1792717383,
}

describe('refreshTokenRequest (node, B2B session)', () => {
  beforeEach(() => {
    mockFetch.mockResolvedValue({
      status: 200,
      json: async () => authenticatorSuccess,
    })
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('posts to the Authenticator route on the store origin with Host header on the server', async () => {
    const result = await refreshTokenRequest({ isB2B: true })

    expect(result).toEqual(authenticatorSuccess)
    expect(mockFetch).toHaveBeenCalledTimes(1)

    const [url, init] = mockFetch.mock.calls[0]
    expect(url).toBe(AUTHENTICATOR_URL)
    expect(init.method).toBe('POST')
    expect(init.credentials).toBe('include')
    expect(init.headers).toMatchObject({
      'content-type': 'application/json',
      Host: 'b2bfaststore.vtexfaststore.com',
    })
    expect(JSON.parse(init.body as string)).toEqual({})
  })

  it('does not fall back to the legacy route when the Authenticator fails', async () => {
    mockFetch.mockResolvedValue({ status: 401, json: async () => ({}) })

    const result = await refreshTokenRequest({ isB2B: true })

    expect(result).toBeUndefined()
    expect(mockFetch).toHaveBeenCalledTimes(3)
    expect(
      mockFetch.mock.calls.every(([url]) => url === AUTHENTICATOR_URL)
    ).toBe(true)
  })

  it('returns the Authenticator answer as is when it does not report success', async () => {
    mockFetch.mockResolvedValue({
      status: 200,
      json: async () => ({ authStatus: 'WrongCredentials' }),
    })

    const result = await refreshTokenRequest({ isB2B: true })

    expect(result).toEqual({ authStatus: 'WrongCredentials' })
    expect(isRefreshTokenSuccessful(result)).toBe(false)
    expect(mockFetch).toHaveBeenCalledTimes(1)
  })

  it('retries non-200 answers on the Authenticator route only', async () => {
    mockFetch.mockResolvedValue({ status: 500, json: async () => ({}) })

    const result = await refreshTokenRequest({ isB2B: true })

    expect(result).toBeUndefined()
    expect(mockFetch).toHaveBeenCalledTimes(3)
  })

  it('retries after network errors and succeeds on a later attempt', async () => {
    mockFetch
      .mockRejectedValueOnce(new Error('network'))
      .mockResolvedValueOnce({
        status: 200,
        json: async () => authenticatorSuccess,
      })

    const result = await refreshTokenRequest({ isB2B: true })

    expect(result).toEqual(authenticatorSuccess)
    expect(mockFetch).toHaveBeenCalledTimes(2)
    expect(mockFetch.mock.calls[1][0]).toBe(AUTHENTICATOR_URL)
  })
})

describe('refreshTokenRequest (node, non-B2B session)', () => {
  beforeEach(() => {
    mockFetch.mockResolvedValue({
      status: 200,
      json: async () => ({ status: 'Success', refreshAfter: '123' }),
    })
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('only calls the legacy route, as VTEX ID recommends outside B2B', async () => {
    const result = await refreshTokenRequest()

    expect(result).toEqual({ status: 'Success', refreshAfter: '123' })
    expect(mockFetch.mock.calls.map(([url]) => url)).toEqual([LEGACY_URL])
  })

  it('retries 5xx on the legacy route only', async () => {
    mockFetch.mockResolvedValue({ status: 500, json: async () => ({}) })

    const result = await refreshTokenRequest({ isB2B: false })

    expect(result).toBeUndefined()
    expect(mockFetch).toHaveBeenCalledTimes(3)
    expect(mockFetch.mock.calls.every(([url]) => url === LEGACY_URL)).toBe(true)
  })
})

describe('isB2BSession', () => {
  it('is true when the session has both a unit and a contract', () => {
    expect(
      isB2BSession({ b2b: { unitId: 'unit-1', customerId: 'contract-1' } })
    ).toBe(true)
  })

  it.each([
    ['no b2b', { b2b: null }],
    ['an empty unitId', { b2b: { unitId: '', customerId: 'contract-1' } }],
    ['an empty customerId', { b2b: { unitId: 'unit-1', customerId: '' } }],
    ['no ids', { b2b: {} }],
  ])('is false with %s', (_, session) => {
    // `b2b` exists for every isRepresentative token, which can be true
    // outside B2B, so the ids decide.
    expect(isB2BSession(session)).toBe(false)
  })

  it('is false without a session', () => {
    expect(isB2BSession(null)).toBe(false)
    expect(isB2BSession(undefined)).toBe(false)
  })
})

describe('isRefreshTokenSuccessful', () => {
  it('accepts the legacy status field (case-insensitive)', () => {
    expect(isRefreshTokenSuccessful({ status: 'Success' })).toBe(true)
  })

  it('accepts the Authenticator authStatus field', () => {
    expect(isRefreshTokenSuccessful({ authStatus: 'Success' })).toBe(true)
  })

  it('returns false when status is missing or not success', () => {
    expect(isRefreshTokenSuccessful(undefined)).toBe(false)
    expect(isRefreshTokenSuccessful({ status: 'failed' })).toBe(false)
    expect(isRefreshTokenSuccessful({ authStatus: 'failed' })).toBe(false)
  })
})

describe('getRefreshAfterSeconds', () => {
  it('keeps epoch seconds from the Authenticator', () => {
    expect(getRefreshAfterSeconds({ refreshAfter: 1792717383 })).toBe(
      '1792717383'
    )
    expect(getRefreshAfterSeconds({ refreshAfter: '1792717383' })).toBe(
      '1792717383'
    )
  })

  it('converts the legacy ISO date to epoch seconds', () => {
    expect(
      getRefreshAfterSeconds({ refreshAfter: '2026-10-20T05:36:52+00:00' })
    ).toBe(String(Date.UTC(2026, 9, 20, 5, 36, 52) / 1000))
  })

  it('returns null when the value is missing or unparseable', () => {
    expect(getRefreshAfterSeconds(undefined)).toBeNull()
    expect(getRefreshAfterSeconds({})).toBeNull()
    expect(getRefreshAfterSeconds({ refreshAfter: '' })).toBeNull()
    expect(getRefreshAfterSeconds({ refreshAfter: 'soon' })).toBeNull()
  })
})

describe('getNextRefreshAfter', () => {
  it('uses the refreshAfter from the response', () => {
    expect(getNextRefreshAfter({ refreshAfter: 1792717383 }, 100)).toBe(
      '1792717383'
    )
  })

  it('falls back to a short delay from now when the response has none', () => {
    expect(getNextRefreshAfter({ authStatus: 'Success' }, 100)).toBe(
      String(100 + REFRESH_AFTER_FALLBACK_SECONDS)
    )
  })
})
