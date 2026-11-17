/**
 * @vitest-environment jsdom
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const mockFetch = vi.hoisted(() => vi.fn())
vi.mock('isomorphic-unfetch', () => ({ __esModule: true, default: mockFetch }))

import {
  ContractSwitchError,
  changeContractToken,
  isContractSwitchEnabled,
} from '../../../src/sdk/account/changeContractToken'

describe('changeContractToken', () => {
  beforeEach(() => {
    mockFetch.mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ success: true }),
    })
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('is enabled', () => {
    expect(isContractSwitchEnabled).toBe(true)
  })

  it('rejects when contractId is missing', async () => {
    await expect(changeContractToken('')).rejects.toThrow(ContractSwitchError)
    expect(mockFetch).not.toHaveBeenCalled()
  })

  it('posts the contractId to the switch-contract route', async () => {
    const contractId = '69b5d80e-8f61-44e0-a5cb-db54c326699c'

    await expect(changeContractToken(contractId)).resolves.toBe(true)

    expect(mockFetch).toHaveBeenCalledTimes(1)
    const [url, init] = mockFetch.mock.calls[0]
    expect(url).toBe('/api/fs/switch-contract')
    expect(init.method).toBe('POST')
    expect(init.credentials).toBe('include')
    expect(init.signal).toBeDefined()
    expect(JSON.parse(init.body as string)).toEqual({ contractId })
  })

  it('never writes cookies from the client', async () => {
    await changeContractToken('contract-1')

    expect(document.cookie).not.toContain('VtexIdclientAutCookie')
  })

  it('throws when the route responds with a failure status', async () => {
    mockFetch.mockResolvedValueOnce({ ok: false, status: 401 })

    await expect(changeContractToken('contract-1')).rejects.toThrow(
      /Failed to switch contract \(401\)/
    )
  })

  it('throws when the request times out', async () => {
    const timeoutError = new Error('The operation was aborted')
    timeoutError.name = 'TimeoutError'
    mockFetch.mockRejectedValueOnce(timeoutError)

    await expect(changeContractToken('contract-1')).rejects.toThrow(
      /Contract switch timed out/
    )
  })

  it('throws when the network call fails', async () => {
    mockFetch.mockRejectedValueOnce(new Error('offline'))

    await expect(changeContractToken('contract-1')).rejects.toThrow(
      /Failed to switch contract: offline/
    )
  })

  it('throws when the route reports success: false', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({ success: false, error: 'nope' }),
    })

    await expect(changeContractToken('contract-1')).rejects.toThrow(
      /Contract switch was not successful/
    )
  })

  it('throws when the response body is not valid JSON', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => {
        throw new Error('invalid json')
      },
    })

    await expect(changeContractToken('contract-1')).rejects.toThrow(
      /Contract switch was not successful/
    )
  })
})
