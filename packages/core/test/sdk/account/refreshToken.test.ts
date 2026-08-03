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
  isRefreshTokenSuccessful,
  refreshTokenRequest,
} from '../../../src/sdk/account/refreshToken'

describe('refreshTokenRequest (node)', () => {
  beforeEach(() => {
    mockFetch.mockResolvedValue({
      status: 200,
      json: async () => ({ status: 'success', refreshAfter: '123' }),
    })
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('posts to the store origin with Host header on the server', async () => {
    const result = await refreshTokenRequest()

    expect(result).toEqual({ status: 'success', refreshAfter: '123' })
    expect(mockFetch).toHaveBeenCalledTimes(1)

    const [url, init] = mockFetch.mock.calls[0]
    expect(url).toBe(
      'https://b2bfaststore.vtexfaststore.com/api/vtexid/refreshtoken/webstore'
    )
    expect(init.method).toBe('POST')
    expect(init.credentials).toBe('include')
    expect(init.headers).toMatchObject({
      'content-type': 'application/json',
      Host: 'b2bfaststore.vtexfaststore.com',
    })
    expect(JSON.parse(init.body as string)).toEqual({})
  })

  it('retries when the response is not 200 and returns undefined after failures', async () => {
    mockFetch
      .mockResolvedValueOnce({ status: 500, json: async () => ({}) })
      .mockResolvedValueOnce({ status: 500, json: async () => ({}) })
      .mockResolvedValueOnce({ status: 500, json: async () => ({}) })

    const result = await refreshTokenRequest()

    expect(result).toBeUndefined()
    expect(mockFetch).toHaveBeenCalledTimes(3)
  })

  it('retries after network errors and succeeds on a later attempt', async () => {
    mockFetch
      .mockRejectedValueOnce(new Error('network'))
      .mockResolvedValueOnce({
        status: 200,
        json: async () => ({ status: 'success' }),
      })

    const result = await refreshTokenRequest()

    expect(result).toEqual({ status: 'success' })
    expect(mockFetch).toHaveBeenCalledTimes(2)
  })
})

describe('isRefreshTokenSuccessful', () => {
  it('returns true when status is success (case-insensitive)', () => {
    expect(isRefreshTokenSuccessful({ status: 'Success' })).toBe(true)
  })

  it('returns false when status is missing or not success', () => {
    expect(isRefreshTokenSuccessful(undefined)).toBe(false)
    expect(isRefreshTokenSuccessful({ status: 'failed' })).toBe(false)
  })
})
