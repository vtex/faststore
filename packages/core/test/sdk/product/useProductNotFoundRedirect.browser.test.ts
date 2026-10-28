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

const b2bSession = {
  b2b: { unitId: 'unit-1', customerId: 'contract-137' },
  isValidating: false,
}
const anonymousSession = { b2b: null, isValidating: false }
const validatingSession = { b2b: null, isValidating: true }

describe('useProductNotFoundRedirect', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  it('replaces the PDP with the 404 page when the BFF answers 404 to a B2B shopper', () => {
    mockUseSession.mockReturnValue(b2bSession)

    renderHook(() => useProductNotFoundRedirect({ status: 404 }))

    expect(mockReplace).toHaveBeenCalledWith('/404')
  })

  it('navigates once even when the router changes identity', () => {
    mockUseSession.mockReturnValue(b2bSession)

    // The mocked `useRouter` returns a new object on every render.
    const { rerender } = renderHook(() =>
      useProductNotFoundRedirect({ status: 404 })
    )
    rerender()
    rerender()

    expect(mockReplace).toHaveBeenCalledTimes(1)
  })

  it('redirects again for a later not-found after one that cleared', () => {
    mockUseSession.mockReturnValue(b2bSession)

    const { rerender } = renderHook(
      ({ error }: { error: unknown }) => useProductNotFoundRedirect(error),
      { initialProps: { error: { status: 404 } as unknown } }
    )
    rerender({ error: undefined })
    rerender({ error: { status: 404 } })

    expect(mockReplace).toHaveBeenCalledTimes(2)
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

  it.each([
    ['without a unit', { customerId: 'contract-137' }],
    ['without a contract', { unitId: 'unit-1', customerId: '' }],
  ])('keeps the static product for a b2b session %s', (_label, b2b) => {
    mockUseSession.mockReturnValue({ b2b, isValidating: false })

    const { result } = renderHook(() =>
      useProductNotFoundRedirect({ status: 404 })
    )

    expect(mockReplace).not.toHaveBeenCalled()
    expect(result.current).toBe(false)
  })

  it('keeps the static product for shoppers without a B2B session', () => {
    mockUseSession.mockReturnValue(anonymousSession)

    const { result } = renderHook(() =>
      useProductNotFoundRedirect({ status: 404 })
    )

    expect(mockReplace).not.toHaveBeenCalled()
    expect(result.current).toBe(false)
  })

  it('keeps the PDP loading while the 404 redirect is pending', () => {
    mockUseSession.mockReturnValue(b2bSession)

    const { result } = renderHook(() =>
      useProductNotFoundRedirect({ status: 404 })
    )

    expect(result.current).toBe(true)
  })

  it('keeps the PDP loading while the session has not told whether the shopper is B2B', () => {
    mockUseSession.mockReturnValue(validatingSession)

    const { result } = renderHook(() =>
      useProductNotFoundRedirect({ status: 404 })
    )

    expect(mockReplace).not.toHaveBeenCalled()
    expect(result.current).toBe(true)
  })

  it('releases the PDP once the session settles without a B2B buyer', () => {
    mockUseSession.mockReturnValue(validatingSession)

    const { result, rerender } = renderHook(() =>
      useProductNotFoundRedirect({ status: 404 })
    )
    expect(result.current).toBe(true)

    mockUseSession.mockReturnValue(anonymousSession)
    rerender()

    expect(result.current).toBe(false)
    expect(mockReplace).not.toHaveBeenCalled()
  })

  it('does not hold the PDP when the refetch succeeds', () => {
    mockUseSession.mockReturnValue(validatingSession)

    const { result } = renderHook(() => useProductNotFoundRedirect(undefined))

    expect(result.current).toBe(false)
  })
})
