/**
 * @vitest-environment jsdom
 */

import { afterEach, describe, expect, it, vi } from 'vitest'

const mockGetCookie = vi.hoisted(() => vi.fn())
vi.mock('src/utils/getCookie', () => ({ getCookie: mockGetCookie }))

import { getUserIdFromCookie } from 'src/sdk/analytics/utils'

afterEach(() => {
  vi.clearAllMocks()
  vi.unstubAllGlobals()
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
