/**
 * @vitest-environment jsdom
 */

import { act, renderHook, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const mockReload = vi.hoisted(() => vi.fn())
const mockClearPersistedSessionState = vi.hoisted(() => vi.fn())

vi.mock('src/sdk/account/clearPersistedSessionState', () => ({
  clearPersistedSessionState: mockClearPersistedSessionState,
}))

import * as changeContractTokenModule from '../../../src/sdk/account/changeContractToken'
import { useSwitchContract } from '../../../src/sdk/account/useSwitchContract'

describe('useSwitchContract', () => {
  beforeEach(() => {
    mockClearPersistedSessionState.mockResolvedValue(undefined)
    mockReload.mockReset()
    Object.defineProperty(globalThis.window, 'location', {
      configurable: true,
      value: { ...globalThis.window.location, reload: mockReload },
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

  it('does not clear session or reload when switch-properties returns false', async () => {
    const { result } = renderHook(() => useSwitchContract())

    let ok: boolean | undefined
    await act(async () => {
      ok = await result.current.switchContract('contract-2')
    })

    expect(ok).toBe(false)
    expect(mockClearPersistedSessionState).not.toHaveBeenCalled()
    expect(mockReload).not.toHaveBeenCalled()
    expect(result.current.enabled).toBe(true)

    await waitFor(() => expect(result.current.error).toBeInstanceOf(Error))
  })

  it('clears persisted session and reloads after a successful switch (REQ-06)', async () => {
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
    expect(mockClearPersistedSessionState).toHaveBeenCalledTimes(1)
    expect(mockReload).toHaveBeenCalledTimes(1)
    expect(result.current.error).toBeNull()
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
    expect(mockClearPersistedSessionState).not.toHaveBeenCalled()
    expect(mockReload).not.toHaveBeenCalled()

    await waitFor(() => expect(result.current.error).toBeInstanceOf(Error))
  })

  it('normalizes non-Error failures from switch-properties', async () => {
    vi.spyOn(
      changeContractTokenModule,
      'changeContractToken'
    ).mockRejectedValueOnce('unexpected')

    const { result } = renderHook(() => useSwitchContract())

    let ok: boolean | undefined
    await act(async () => {
      ok = await result.current.switchContract('contract-2')
    })

    expect(ok).toBe(false)

    await waitFor(() =>
      expect(result.current.error?.message).toBe('Failed to switch contract')
    )
  })
})
