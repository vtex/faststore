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
  applyVtexAuthCookieFromSwitchResponse,
  changeContractToken,
  isContractSwitchEnabled,
} from '../../../src/sdk/account/changeContractToken'

const successPayload = {
  authStatus: 'Success',
  expiresIn: 86_399,
  authCookie: {
    Name: 'VtexIdclientAutCookie_b2bfaststoredev',
    Value: 'new-contract-token',
  },
  accountAuthCookie: null,
}

describe('changeContractToken', () => {
  beforeEach(() => {
    document.cookie = ''
    mockFetch.mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => successPayload,
    })
  })

  afterEach(() => {
    document.cookie = ''
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
    expect(init.signal).toBeDefined()
    expect(JSON.parse(init.body as string)).toEqual({
      properties: { customerId: contractId },
    })
  })

  it('applies the auth cookie returned by switch-properties', async () => {
    await changeContractToken('contract-1')

    expect(document.cookie).toContain(
      'VtexIdclientAutCookie_b2bfaststoredev=new-contract-token'
    )
  })

  it('throws when the switch request fails', async () => {
    mockFetch.mockResolvedValueOnce({ ok: false, status: 401 })

    await expect(changeContractToken('contract-1')).rejects.toThrow(
      /Failed to switch contract \(401\)/
    )
  })

  it('throws when the switch request times out', async () => {
    const timeoutError = new Error('The operation was aborted')
    timeoutError.name = 'TimeoutError'
    mockFetch.mockRejectedValueOnce(timeoutError)

    await expect(changeContractToken('contract-1')).rejects.toThrow(
      /Contract switch timed out/
    )
  })

  it('throws when authStatus is not success', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({ ...successPayload, authStatus: 'Failed' }),
    })

    await expect(changeContractToken('contract-1')).rejects.toThrow(
      /Contract switch was not successful/
    )
  })

  it('throws when authCookie is missing from a successful response', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({
        authStatus: 'Success',
        authCookie: null,
      }),
    })

    await expect(changeContractToken('contract-1')).rejects.toThrow(
      /no auth cookie was returned/
    )
  })
})

describe('applyVtexAuthCookieFromSwitchResponse', () => {
  beforeEach(() => {
    document.cookie = ''
  })

  afterEach(() => {
    document.cookie = ''
  })

  it('sets auth and account auth cookies when present', () => {
    applyVtexAuthCookieFromSwitchResponse({
      expiresIn: 3600,
      authCookie: {
        Name: 'VtexIdclientAutCookie_b2bfaststoredev',
        Value: 'store-token',
      },
      accountAuthCookie: {
        Name: 'VtexIdclientAutCookie_account',
        Value: 'account-token',
      },
    })

    expect(document.cookie).toContain(
      'VtexIdclientAutCookie_b2bfaststoredev=store-token'
    )
    expect(document.cookie).toContain(
      'VtexIdclientAutCookie_account=account-token'
    )
  })
})
