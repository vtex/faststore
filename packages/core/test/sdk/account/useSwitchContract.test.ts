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

import { useSwitchContract } from '../../../src/sdk/account/useSwitchContract'
import { changeContractToken } from '../../../src/sdk/account/changeContractToken'

describe('changeContractToken', () => {
  it('rejects when contractId is missing', async () => {
    await expect(changeContractToken('')).rejects.toThrow(/contractId/i)
  })

  it('resolves for a valid contractId', async () => {
    await expect(changeContractToken('contract-1')).resolves.toBeUndefined()
  })
})

describe('useSwitchContract', () => {
  beforeEach(() => {
    mockValidateSession.mockResolvedValue({ b2b: { contractName: 'New Corp' } })
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('switches context: revalidates the session and resets the cart (REQ-06)', async () => {
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
