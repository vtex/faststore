/**
 * @vitest-environment jsdom
 */

import { renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

const mockUseSession = vi.hoisted(() => vi.fn())
vi.mock('src/sdk/session', () => ({ useSession: mockUseSession }))

import { useAuth } from '../../../src/sdk/auth'

describe('useAuth', () => {
  it('isAuthenticated is true when hasSalesChannel and person is set', () => {
    mockUseSession.mockReturnValue({
      person: { id: 'user-1', email: 'test@example.com' },
      isValidating: false,
      channel: JSON.stringify({
        salesChannel: 1,
        regionId: 'r1',
        hasOnlyDefaultSalesChannel: false,
      }),
    })

    const { result } = renderHook(() => useAuth())

    expect(result.current.isAuthenticated).toBeTruthy()
  })

  it('isAuthenticated is false when hasOnlyDefaultSalesChannel is true', () => {
    mockUseSession.mockReturnValue({
      person: { id: 'user-1' },
      isValidating: false,
      channel: JSON.stringify({
        salesChannel: 1,
        regionId: 'r1',
        hasOnlyDefaultSalesChannel: true,
      }),
    })

    const { result } = renderHook(() => useAuth())

    expect(result.current.isAuthenticated).toBeFalsy()
  })

  it('isAuthenticated is false when person is null', () => {
    mockUseSession.mockReturnValue({
      person: null,
      isValidating: false,
      channel: JSON.stringify({
        salesChannel: 1,
        regionId: 'r1',
        hasOnlyDefaultSalesChannel: false,
      }),
    })

    const { result } = renderHook(() => useAuth())

    expect(result.current.isAuthenticated).toBeFalsy()
  })

  it('isAuthenticated is false when salesChannel is falsy', () => {
    mockUseSession.mockReturnValue({
      person: { id: 'user-1' },
      isValidating: false,
      channel: JSON.stringify({
        salesChannel: 0,
        regionId: 'r1',
        hasOnlyDefaultSalesChannel: false,
      }),
    })

    const { result } = renderHook(() => useAuth())

    expect(result.current.isAuthenticated).toBeFalsy()
  })

  it('exposes profile and isValidating from session', () => {
    const person = { id: 'user-1', email: 'test@example.com' }
    mockUseSession.mockReturnValue({
      person,
      isValidating: true,
      channel: JSON.stringify({
        salesChannel: 1,
        hasOnlyDefaultSalesChannel: false,
      }),
    })

    const { result } = renderHook(() => useAuth())

    expect(result.current.profile).toBe(person)
    expect(result.current.isValidating).toBe(true)
  })
})
