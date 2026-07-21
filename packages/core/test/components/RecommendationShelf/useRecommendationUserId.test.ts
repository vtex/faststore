/**
 * @vitest-environment jsdom
 */

import { renderHook, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const getUserIdFromCookie = vi.hoisted(() => vi.fn())
vi.mock('src/sdk/analytics/utils', () => ({ getUserIdFromCookie }))

// Run the retried function once and resolve/reject with its result so the tests
// don't wait on the real backoff schedule.
vi.mock('src/utils/retry', () => ({
  retry: (fn: () => unknown) => Promise.resolve().then(fn),
}))

import { useRecommendationUserId } from 'src/components/sections/RecommendationShelf/useRecommendationUserId'

const CAMPAIGN_VRN = 'vrn:recommendations:acc:rec-top-items-v2:campaign-1'

beforeEach(() => {
  vi.spyOn(console, 'error').mockImplementation(() => {})
})

afterEach(() => {
  vi.clearAllMocks()
})

describe('useRecommendationUserId', () => {
  it('starts as undefined while resolving', () => {
    getUserIdFromCookie.mockReturnValue('user-1')

    const { result } = renderHook(() => useRecommendationUserId(CAMPAIGN_VRN))

    expect(result.current).toBeUndefined()
  })

  it('resolves the user id from the cookie', async () => {
    getUserIdFromCookie.mockReturnValue('user-1')

    const { result } = renderHook(() => useRecommendationUserId(CAMPAIGN_VRN))

    await waitFor(() => {
      expect(result.current).toBe('user-1')
    })
  })

  it('resolves to null when the cookie has no usable id', async () => {
    getUserIdFromCookie.mockReturnValue('')

    const { result } = renderHook(() => useRecommendationUserId(CAMPAIGN_VRN))

    await waitFor(() => {
      expect(result.current).toBeNull()
    })
  })

  it('resolves to null when the lookup throws', async () => {
    getUserIdFromCookie.mockImplementation(() => {
      throw new Error('boom')
    })

    const { result } = renderHook(() => useRecommendationUserId(CAMPAIGN_VRN))

    await waitFor(() => {
      expect(result.current).toBeNull()
    })
  })
})
