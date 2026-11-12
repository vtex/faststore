import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const fetchMock = vi.hoisted(() => vi.fn())
vi.mock('isomorphic-unfetch', () => ({ default: fetchMock }))

import { returnFromDelegatedSession } from '../../../src/sdk/account/returnFromDelegatedSession'
import { DelegatedSessionError } from '../../../src/sdk/account/startDelegatedSession'

const response = (ok: boolean, status: number, body?: unknown) =>
  ({
    ok,
    status,
    json: async () => {
      if (body === undefined) throw new Error('no body')
      return body
    },
  }) as Response

describe('returnFromDelegatedSession', () => {
  beforeEach(() => fetchMock.mockReset())
  afterEach(() => vi.restoreAllMocks())

  it('posts to the return route with credentials', async () => {
    fetchMock.mockResolvedValue(response(true, 200, { success: true }))

    await expect(returnFromDelegatedSession()).resolves.toBe(true)

    const [url, init] = fetchMock.mock.calls[0]
    expect(url).toBe('/api/fs/delegation-return')
    expect(init.method).toBe('POST')
    expect(init.credentials).toBe('include')
  })

  it('throws a DelegatedSessionError when the route fails', async () => {
    fetchMock.mockResolvedValue(response(false, 502))

    await expect(returnFromDelegatedSession()).rejects.toBeInstanceOf(
      DelegatedSessionError
    )
  })

  it('fails when the route does not confirm success', async () => {
    fetchMock.mockResolvedValue(response(true, 200, { success: false }))
    await expect(returnFromDelegatedSession()).rejects.toBeInstanceOf(
      DelegatedSessionError
    )

    fetchMock.mockResolvedValue(response(true, 200))
    await expect(returnFromDelegatedSession()).rejects.toBeInstanceOf(
      DelegatedSessionError
    )
  })

  it('reports a timeout and a network error as DelegatedSessionError', async () => {
    fetchMock.mockRejectedValueOnce(
      Object.assign(new Error('t'), { name: 'TimeoutError' })
    )
    await expect(returnFromDelegatedSession()).rejects.toThrow(/timed out/)

    fetchMock.mockRejectedValueOnce(new Error('offline'))
    await expect(returnFromDelegatedSession()).rejects.toBeInstanceOf(
      DelegatedSessionError
    )
  })
})
