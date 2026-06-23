/**
 * @vitest-environment jsdom
 */

import { afterEach, describe, expect, it, vi } from 'vitest'

const mockGetCookie = vi.hoisted(() => vi.fn())
vi.mock('src/utils/getCookie', () => ({ getCookie: mockGetCookie }))

import {
  checkIsMobile,
  getUserIdFromCookie,
  getWithRetry,
} from 'src/components/RecommendationShelf/utils'

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

describe('getWithRetry', () => {
  it('resolves immediately when the value is already available', async () => {
    const fn = vi.fn(() => 'ready')
    await expect(getWithRetry(fn)).resolves.toBe('ready')
    expect(fn).toHaveBeenCalledTimes(1)
  })

  it('retries until a truthy value is returned', async () => {
    const fn = vi
      .fn<() => string>()
      .mockReturnValueOnce('')
      .mockReturnValueOnce('')
      .mockReturnValue('later')

    await expect(getWithRetry(fn, { retries: 5, delayMs: 1 })).resolves.toBe(
      'later'
    )
    expect(fn).toHaveBeenCalledTimes(3)
  })

  it('gives up after exhausting the retry budget', async () => {
    const fn = vi.fn(() => '')

    await expect(getWithRetry(fn, { retries: 2, delayMs: 1 })).resolves.toBe('')
    // initial call + 2 retries
    expect(fn).toHaveBeenCalledTimes(3)
  })
})
