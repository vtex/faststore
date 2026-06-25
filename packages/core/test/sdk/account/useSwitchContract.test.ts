/**
 * @vitest-environment jsdom
 */

import { act, renderHook, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const mockRefreshTokenRequest = vi.hoisted(() => vi.fn())
const mockReload = vi.hoisted(() => vi.fn())
const mockClearPersistedSessionState = vi.hoisted(() => vi.fn())

vi.mock('src/sdk/account/refreshToken', () => ({
  refreshTokenRequest: mockRefreshTokenRequest,
  isRefreshTokenSuccessful: (result: { status?: string } | undefined) =>
    result?.status?.toLowerCase?.() === 'success',
}))

vi.mock('src/sdk/account/clearPersistedSessionState', () => ({
  clearPersistedSessionState: mockClearPersistedSessionState,
}))

import * as changeContractTokenModule from '../../../src/sdk/account/changeContractToken'
import { useSwitchContract } from '../../../src/sdk/account/useSwitchContract'

describe('useSwitchContract', () => {
  beforeEach(() => {
    mockRefreshTokenRequest.mockResolvedValue({ status: 'success' })
    mockClearPersistedSessionState.mockResolvedValue(undefined)
    mockReload.mockReset()
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: { ...window.location, reload: mockReload },
    })
    vi.spyOn(
      changeContractTokenModule,
      'changeContractToken'
    ).mockResolvedValue(false)
  })

  afterEach(() => {
    vi.clearAllMocks()
    vi.restoreAllMocks()
  })

  it('does not refresh or reload when switch-properties returns false', async () => {
    const { result } = renderHook(() => useSwitchContract())

    let ok: boolean | undefined
    await act(async () => {
      ok = await result.current.switchContract('contract-2')
    })

    expect(ok).toBe(false)
    expect(mockRefreshTokenRequest).not.toHaveBeenCalled()
    expect(mockReload).not.toHaveBeenCalled()
    expect(result.current.enabled).toBe(true)

    await waitFor(() => expect(result.current.error).toBeInstanceOf(Error))
  })

  it('refreshes auth and reloads the page after a successful switch (REQ-06)', async () => {
    vi.spyOn(
      changeContractTokenModule,
      'changeContractToken'
    ).mockResolvedValueOnce(true)

    const { result } = renderHook(() => useSwitchContract())

    let ok: boolean | undefined
    await act(async () => {
      ok = await result.current.switchContract('contract-2')
    })

    expect(ok).toBe(true)
    expect(mockRefreshTokenRequest).toHaveBeenCalledTimes(1)
    expect(mockClearPersistedSessionState).toHaveBeenCalledTimes(1)
    expect(mockReload).toHaveBeenCalledTimes(1)
    expect(result.current.error).toBeNull()
  })

  it('surfaces an error when refresh fails after switch-properties succeeds', async () => {
    vi.spyOn(
      changeContractTokenModule,
      'changeContractToken'
    ).mockResolvedValueOnce(true)
    mockRefreshTokenRequest.mockResolvedValueOnce({ status: 'failed' })

    const { result } = renderHook(() => useSwitchContract())

    let ok: boolean | undefined
    await act(async () => {
      ok = await result.current.switchContract('contract-2')
    })

    expect(ok).toBe(false)
    expect(mockReload).not.toHaveBeenCalled()

    await waitFor(() => expect(result.current.error).toBeInstanceOf(Error))
  })

  it('surfaces an error when switch-properties fails', async () => {
    vi.spyOn(
      changeContractTokenModule,
      'changeContractToken'
    ).mockRejectedValueOnce(new Error('switch failed'))

    const { result } = renderHook(() => useSwitchContract())

    let ok: boolean | undefined
    await act(async () => {
      ok = await result.current.switchContract('contract-2')
    })

    expect(ok).toBe(false)
    expect(mockRefreshTokenRequest).not.toHaveBeenCalled()
    expect(mockReload).not.toHaveBeenCalled()

    await waitFor(() => expect(result.current.error).toBeInstanceOf(Error))
  })
})
