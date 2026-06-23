/**
 * @vitest-environment jsdom
 */

import { afterEach, describe, expect, it, vi } from 'vitest'

const mockGetCookie = vi.hoisted(() => vi.fn())
vi.mock('src/utils/getCookie', () => ({ getCookie: mockGetCookie }))

import { checkIsMobile, getUserIdFromCookie } from 'src/sdk/analytics/utils'

afterEach(() => {
  vi.clearAllMocks()
  vi.unstubAllGlobals()
})

describe('checkIsMobile', () => {
  it('returns true when the viewport is at or below the mobile breakpoint', () => {
    vi.stubGlobal('window', { innerWidth: 768 })
    expect(checkIsMobile()).toBe(true)
  })

  it('returns false when the viewport is wider than the breakpoint', () => {
    vi.stubGlobal('window', { innerWidth: 1024 })
    expect(checkIsMobile()).toBe(false)
  })

  it('returns false when there is no window (SSR)', () => {
    vi.stubGlobal('window', undefined)
    expect(checkIsMobile()).toBe(false)
  })
})

describe('getUserIdFromCookie', () => {
  it('returns the cookie value when present', () => {
    mockGetCookie.mockReturnValue('user-123')
    expect(getUserIdFromCookie()).toBe('user-123')
  })

  it('falls back to an empty string when the cookie is missing', () => {
    mockGetCookie.mockReturnValue(undefined)
    expect(getUserIdFromCookie()).toBe('')
  })
})
