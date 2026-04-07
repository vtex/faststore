/**
 * @jest-environment jsdom
 */

jest.mock('discovery.config', () => ({
  __esModule: true,
  default: {
    experimental: { refreshToken: true },
  },
}))

jest.mock('isomorphic-unfetch', () => ({
  __esModule: true,
  default: jest.fn(),
}))

import unfetch from 'isomorphic-unfetch'
import {
  isRefreshTokenSuccessful,
  refreshTokenRequest,
} from '../../../src/sdk/account/refreshToken'

const mockedUnfetch = jest.mocked(unfetch)

function mockFetchResult(status: number, body: string) {
  return {
    status,
    text: async () => body,
  }
}

describe('refreshTokenRequest', () => {
  beforeEach(() => {
    mockedUnfetch.mockReset()
  })

  it('calls same-origin proxy with POST and JSON body', async () => {
    mockedUnfetch.mockResolvedValue(
      mockFetchResult(
        200,
        JSON.stringify({
          status: 'Success',
          refreshAfter: '2026-04-08T00:00:00Z',
        })
      ) as Awaited<ReturnType<typeof unfetch>>
    )

    const result = await refreshTokenRequest()

    expect(mockedUnfetch).toHaveBeenCalledWith(
      '/api/fs/refresh-token',
      expect.objectContaining({
        method: 'POST',
        credentials: 'include',
        body: JSON.stringify({}),
      })
    )
    expect(result?.status?.toLowerCase()).toBe('success')
    expect(isRefreshTokenSuccessful(result)).toBe(true)
  })

  it('returns undefined after retries when proxy keeps failing', async () => {
    mockedUnfetch.mockResolvedValue(
      mockFetchResult(401, 'Unauthorized') as Awaited<
        ReturnType<typeof unfetch>
      >
    )

    const result = await refreshTokenRequest()
    expect(result).toBeUndefined()
    expect(mockedUnfetch).toHaveBeenCalledTimes(3)
  })

  it('deduplicates concurrent calls', async () => {
    let resolveFetch: (v: Awaited<ReturnType<typeof unfetch>>) => void
    const deferred = new Promise<Awaited<ReturnType<typeof unfetch>>>((r) => {
      resolveFetch = r
    })

    mockedUnfetch.mockReturnValue(deferred)

    const a = refreshTokenRequest()
    const b = refreshTokenRequest()

    resolveFetch!(
      mockFetchResult(200, JSON.stringify({ status: 'Success' })) as Awaited<
        ReturnType<typeof unfetch>
      >
    )

    await Promise.all([a, b])

    expect(mockedUnfetch).toHaveBeenCalledTimes(1)
  })
})
