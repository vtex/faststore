/**
 * @vitest-environment jsdom
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('discovery.config', () => ({
  default: {
    api: { storeId: 'b2bfaststoredev' },
  },
}))

const mockFetch = vi.hoisted(() => vi.fn())
vi.mock('isomorphic-unfetch', () => ({ __esModule: true, default: mockFetch }))

import {
  ContractSwitchError,
  changeContractToken,
  isContractSwitchEnabled,
} from '../../../src/sdk/account/changeContractToken'

describe('changeContractToken', () => {
  beforeEach(() => {
    mockFetch.mockResolvedValue({ ok: true, status: 200 })
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('is enabled', () => {
    expect(isContractSwitchEnabled).toBe(true)
  })

  it('rejects when contractId is missing', async () => {
    await expect(changeContractToken('')).rejects.toThrow(ContractSwitchError)
  })

  it('posts to switch-properties with the contract customerId', async () => {
    const contractId = '69b5d80e-8f61-44e0-a5cb-db54c326699c'

    await expect(changeContractToken(contractId)).resolves.toBe(true)

    expect(mockFetch).toHaveBeenCalledTimes(1)
    const [url, init] = mockFetch.mock.calls[0]
    expect(url).toBe(
      '/api/authenticator/storefront/credential/switch-properties?an=b2bfaststoredev'
    )
    expect(init.method).toBe('POST')
    expect(init.credentials).toBe('include')
    expect(JSON.parse(init.body as string)).toEqual({
      properties: { customerId: contractId },
    })
  })

  it('throws when the switch request fails', async () => {
    mockFetch.mockResolvedValueOnce({ ok: false, status: 401 })

    await expect(changeContractToken('contract-1')).rejects.toThrow(
      /Failed to switch contract \(401\)/
    )
  })
})
