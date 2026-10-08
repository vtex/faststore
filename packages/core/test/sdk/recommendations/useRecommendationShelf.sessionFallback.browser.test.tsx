import { renderHook, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const usePDP = vi.hoisted(() => vi.fn())
vi.mock('@faststore/core', () => ({ usePDP }))

vi.mock('@faststore/core/api', () => ({
  gql: (s: string) => ({ __meta__: {}, query: s }),
}))

const useCart = vi.hoisted(() => vi.fn())
vi.mock('src/sdk/cart', () => ({ useCart }))

const useRecommendations = vi.hoisted(() => vi.fn())
vi.mock('src/sdk/recommendations/useRecommendations', () => ({
  useRecommendations,
}))

const runStartRecommendationSession = vi.hoisted(() => vi.fn())
vi.mock('src/sdk/graphql/useLazyQuery', () => ({
  useLazyQuery: () => [runStartRecommendationSession, {}],
}))

const cookies = vi.hoisted(() => ({
  current: {} as Record<string, string | undefined>,
}))
vi.mock('src/utils/getCookie', () => ({
  getCookie: (name: string) => cookies.current[name],
}))

const storeConfigMock = vi.hoisted(() => ({
  experimental: { enableRecommendations: false },
}))
vi.mock('discovery.config', () => ({ default: storeConfigMock }))

// Keep retry semantics (loop until `until` / attempts) but skip wall-clock
// backoff so the cookie lookup can observe the session mutation in this test.
vi.mock('src/utils/retry', async (importOriginal) => {
  const actual = await importOriginal<typeof import('src/utils/retry')>()
  return {
    retry: <T,>(
      fn: () => T | Promise<T>,
      options?: Parameters<typeof actual.retry>[1]
    ) => actual.retry(fn, { ...options, delayMs: 0, maxDelayMs: 0 }),
  }
})

import { resetStartRecommendationSessionLock } from 'src/sdk/analytics/hooks/useStartRecommendationSession'
import { useRecommendationShelf } from 'src/sdk/recommendations/useRecommendationShelf'

const TOP_ITEMS_VRN = 'vrn:recommendations:acc:rec-top-items-v2:campaign-1'

const lastArgs = () => useRecommendations.mock.calls.at(-1)?.[0]

beforeEach(() => {
  cookies.current = {}
  resetStartRecommendationSessionLock()
  storeConfigMock.experimental.enableRecommendations = false
  usePDP.mockReturnValue({ data: undefined })
  useCart.mockReturnValue({ items: [] })
  useRecommendations.mockReturnValue({
    data: undefined,
    isLoading: false,
    error: null,
  })
  runStartRecommendationSession.mockImplementation(async () => {
    cookies.current['vtex-rec-user-id'] = 'user-from-session'
    cookies.current['vtex-rec-user-start-session'] = '1'
    return true
  })
})

afterEach(() => {
  vi.clearAllMocks()
})

describe('useRecommendationShelf session fallback race', () => {
  it('starts the session in parallel with cookie retry so the first page can fetch', async () => {
    renderHook(() => useRecommendationShelf({ campaignVrn: TOP_ITEMS_VRN }))

    await waitFor(() => {
      expect(runStartRecommendationSession).toHaveBeenCalledTimes(1)
    })

    await waitFor(() => {
      expect(lastArgs()).toEqual({
        userId: 'user-from-session',
        campaignVrn: TOP_ITEMS_VRN,
        products: [],
      })
    })
  })

  it('does not start a session when the user id cookie is already present', async () => {
    cookies.current['vtex-rec-user-id'] = 'existing-user'
    cookies.current['vtex-rec-user-start-session'] = '1'

    renderHook(() => useRecommendationShelf({ campaignVrn: TOP_ITEMS_VRN }))

    await waitFor(() => {
      expect(lastArgs()).toEqual({
        userId: 'existing-user',
        campaignVrn: TOP_ITEMS_VRN,
        products: [],
      })
    })

    expect(runStartRecommendationSession).not.toHaveBeenCalled()
  })
})
