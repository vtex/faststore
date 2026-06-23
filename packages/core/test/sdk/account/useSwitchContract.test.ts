/**
 * @vitest-environment jsdom
 */

import { act, renderHook, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const mockValidateSession = vi.hoisted(() => vi.fn())
const mockSessionSet = vi.hoisted(() => vi.fn())
const mockEmptyCart = vi.hoisted(() => vi.fn())
const previousSession = { b2b: { contractName: 'Previous Corp' } }

vi.mock('src/sdk/session', () => ({
  validateSession: mockValidateSession,
  sessionStore: {
    read: () => previousSession,
    set: mockSessionSet,
  },
}))

vi.mock('src/sdk/cart', () => ({
  cartStore: { emptyCart: mockEmptyCart },
}))

import * as changeContractTokenModule from '../../../src/sdk/account/changeContractToken'
import { useSwitchContract } from '../../../src/sdk/account/useSwitchContract'

const { changeContractToken } = changeContractTokenModule

describe('changeContractToken', () => {
  it('rejects when contractId is missing', async () => {
    await expect(changeContractToken('')).rejects.toThrow(/contractId/i)
  })

  it('returns false for a valid contractId while ChangeToken is unwired', async () => {
    await expect(changeContractToken('contract-1')).resolves.toBe(false)
  })
})

describe('useSwitchContract', () => {
  beforeEach(() => {
    mockValidateSession.mockResolvedValue({ b2b: { contractName: 'New Corp' } })
    vi.spyOn(
      changeContractTokenModule,
      'changeContractToken'
    ).mockResolvedValue(false)
  })

  afterEach(() => {
    vi.clearAllMocks()
    vi.restoreAllMocks()
  })

  it('does not reset the cart when ChangeToken is a no-op (stub)', async () => {
    const { result } = renderHook(() => useSwitchContract())

    let ok: boolean | undefined
    await act(async () => {
      ok = await result.current.switchContract('contract-2')
    })

    expect(ok).toBe(false)
    expect(mockValidateSession).not.toHaveBeenCalled()
    expect(mockSessionSet).not.toHaveBeenCalled()
    expect(mockEmptyCart).not.toHaveBeenCalled()
    expect(result.current.enabled).toBe(false)

    await waitFor(() => expect(result.current.error).toBeInstanceOf(Error))
  })

  it('switches context: revalidates the session and resets the cart (REQ-06)', async () => {
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
    expect(mockValidateSession).toHaveBeenCalledWith(previousSession)
    expect(mockSessionSet).toHaveBeenCalledWith({
      b2b: { contractName: 'New Corp' },
    })
    expect(mockEmptyCart).toHaveBeenCalledTimes(1)
    expect(result.current.error).toBeNull()
  })

  it('keeps the previous contract active and surfaces an error on failure', async () => {
    vi.spyOn(
      changeContractTokenModule,
      'changeContractToken'
    ).mockResolvedValueOnce(true)
    mockValidateSession.mockRejectedValueOnce(new Error('revalidate failed'))

    const { result } = renderHook(() => useSwitchContract())

    let ok: boolean | undefined
    await act(async () => {
      ok = await result.current.switchContract('contract-2')
    })

    expect(ok).toBe(false)
    // Previous contract stays active, cart is not reset.
    expect(mockSessionSet).toHaveBeenCalledWith(previousSession)
    expect(mockEmptyCart).not.toHaveBeenCalled()

    await waitFor(() => expect(result.current.error).toBeInstanceOf(Error))
  })
})
