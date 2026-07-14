/**
 * @vitest-environment jsdom
 */

import { renderHook, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('@faststore/core/api', () => ({
  gql: (s: string) => ({ __meta__: {}, query: s }),
}))

const runStartRecommendationSession = vi.hoisted(() => vi.fn())
const useLazyQueryMock = vi.hoisted(() => vi.fn())
vi.mock('src/sdk/graphql/useLazyQuery', () => ({
  useLazyQuery: useLazyQueryMock,
}))

const getCookie = vi.hoisted(() => vi.fn())
vi.mock('src/utils/getCookie', () => ({ getCookie }))

const storeConfigMock = vi.hoisted(() => ({
  experimental: { enableRecommendations: true },
}))
vi.mock('discovery.config', () => ({ default: storeConfigMock }))

import { useStartRecommendationSession } from 'src/sdk/analytics/hooks/useStartRecommendationSession'

beforeEach(() => {
  useLazyQueryMock.mockReturnValue([runStartRecommendationSession, {}])
  runStartRecommendationSession.mockResolvedValue(true)
  storeConfigMock.experimental.enableRecommendations = true
})

afterEach(() => {
  vi.clearAllMocks()
})

describe('useStartRecommendationSession', () => {
  it('does not start a session when the session cookie already exists', async () => {
    getCookie.mockReturnValue('already-started')

    renderHook(() => useStartRecommendationSession())

    await waitFor(() => {
      expect(runStartRecommendationSession).not.toHaveBeenCalled()
    })
  })

  it('starts a session when no session cookie is present', async () => {
    getCookie.mockReturnValue(undefined)

    renderHook(() => useStartRecommendationSession())

    await waitFor(() => {
      expect(runStartRecommendationSession).toHaveBeenCalled()
    })
  })

  it('does not start a session when recommendations are disabled', async () => {
    storeConfigMock.experimental.enableRecommendations = false
    getCookie.mockReturnValue(undefined)

    renderHook(() => useStartRecommendationSession())

    await waitFor(() => {
      expect(runStartRecommendationSession).not.toHaveBeenCalled()
    })
  })
})
