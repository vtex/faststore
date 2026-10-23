/**
 * @vitest-environment jsdom
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const mockFetch = vi.hoisted(() => vi.fn())

vi.mock('isomorphic-unfetch', () => ({ __esModule: true, default: mockFetch }))

import { refreshTokenRequest } from '../../../src/sdk/account/refreshToken'

describe('refreshTokenRequest (browser)', () => {
  beforeEach(() => {
    mockFetch.mockResolvedValue({
      status: 200,
      json: async () => ({ authStatus: 'Success' }),
    })
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('uses a relative URL and omits Host header in the browser', async () => {
    await refreshTokenRequest()

    expect(mockFetch).toHaveBeenCalledTimes(1)

    const [url, init] = mockFetch.mock.calls[0]
    expect(url).toBe('/api/vtexid/refreshtoken/webstore')
    expect(init.headers).toEqual({ 'content-type': 'application/json' })
  })

  it('uses the relative Authenticator route for B2B sessions', async () => {
    await refreshTokenRequest({ isB2B: true })

    expect(mockFetch).toHaveBeenCalledTimes(1)
    expect(mockFetch.mock.calls[0][0]).toBe(
      '/api/authenticator/v1/refreshtoken/webstore'
    )
  })
})
