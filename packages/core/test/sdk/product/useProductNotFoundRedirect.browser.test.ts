/**
 * @vitest-environment jsdom
 */

import { renderHook } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

const mockReplace = vi.hoisted(() => vi.fn())

vi.mock('next/router', () => ({
  useRouter: () => ({ replace: mockReplace }),
}))

import { useProductNotFoundRedirect } from '../../../src/sdk/product/useProductNotFoundRedirect'

describe('useProductNotFoundRedirect', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  it('replaces the PDP with the 404 page when the BFF answers 404', () => {
    renderHook(() => useProductNotFoundRedirect({ status: 404 }))

    expect(mockReplace).toHaveBeenCalledWith('/404')
  })

  it('redirects without waiting for the session', () => {
    // A segment restriction rejects the product for any shopper, B2B or not,
    // so the hook does not read the session at all.
    const { result } = renderHook(() =>
      useProductNotFoundRedirect({ status: 404 })
    )

    expect(result.current).toBe(true)
    expect(mockReplace).toHaveBeenCalledTimes(1)
  })

  it('navigates once even when the router changes identity', () => {
    // The mocked `useRouter` returns a new object on every render.
    const { rerender } = renderHook(() =>
      useProductNotFoundRedirect({ status: 404 })
    )
    rerender()
    rerender()

    expect(mockReplace).toHaveBeenCalledTimes(1)
  })

  it('redirects again for a later not-found after one that cleared', () => {
    const { rerender } = renderHook(
      ({ error }: { error: unknown }) => useProductNotFoundRedirect(error),
      { initialProps: { error: { status: 404 } as unknown } }
    )
    rerender({ error: undefined })
    rerender({ error: { status: 404 } })

    expect(mockReplace).toHaveBeenCalledTimes(2)
  })

  it('recognizes a NotFoundError carried in the GraphQL extensions', () => {
    renderHook(() =>
      useProductNotFoundRedirect({ extensions: { type: 'NotFoundError' } })
    )

    expect(mockReplace).toHaveBeenCalledTimes(1)
  })

  it('does nothing while the refetch has no error', () => {
    const { result } = renderHook(() => useProductNotFoundRedirect(undefined))

    expect(mockReplace).not.toHaveBeenCalled()
    expect(result.current).toBe(false)
  })

  it('does nothing for errors other than not found', () => {
    const { result } = renderHook(() =>
      useProductNotFoundRedirect({ status: 500 })
    )

    expect(mockReplace).not.toHaveBeenCalled()
    expect(result.current).toBe(false)
  })
})
