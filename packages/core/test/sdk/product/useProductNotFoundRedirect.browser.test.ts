/**
 * @vitest-environment jsdom
 */

import { renderHook } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

const mockReplace = vi.hoisted(() => vi.fn())
const mockUseSession = vi.hoisted(() => vi.fn())

vi.mock('next/router', () => ({
  useRouter: () => ({ replace: mockReplace }),
}))
vi.mock('src/sdk/session', () => ({ useSession: mockUseSession }))

import { useProductNotFoundRedirect } from '../../../src/sdk/product/useProductNotFoundRedirect'

const b2bSession = { b2b: { customerId: 'contract-137' } }
const anonymousSession = { b2b: null }

describe('useProductNotFoundRedirect', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  it('replaces the PDP with the 404 page when the BFF answers 404 to a B2B shopper', () => {
    mockUseSession.mockReturnValue(b2bSession)

    renderHook(() => useProductNotFoundRedirect({ status: 404 }))

    expect(mockReplace).toHaveBeenCalledWith('/404')
  })

  it('recognizes a NotFoundError carried in the GraphQL extensions', () => {
    mockUseSession.mockReturnValue(b2bSession)

    renderHook(() =>
      useProductNotFoundRedirect({ extensions: { type: 'NotFoundError' } })
    )

    expect(mockReplace).toHaveBeenCalledTimes(1)
  })

  it('does nothing while the refetch has no error', () => {
    mockUseSession.mockReturnValue(b2bSession)

    renderHook(() => useProductNotFoundRedirect(undefined))

    expect(mockReplace).not.toHaveBeenCalled()
  })

  it('does nothing for errors other than not found', () => {
    mockUseSession.mockReturnValue(b2bSession)

    renderHook(() => useProductNotFoundRedirect({ status: 500 }))

    expect(mockReplace).not.toHaveBeenCalled()
  })

  it('keeps the static product for shoppers without a B2B session', () => {
    mockUseSession.mockReturnValue(anonymousSession)

    renderHook(() => useProductNotFoundRedirect({ status: 404 }))

    expect(mockReplace).not.toHaveBeenCalled()
  })
})
