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

import {
  resetStartRecommendationSessionLock,
  useStartRecommendationSession,
} from 'src/sdk/analytics/hooks/useStartRecommendationSession'

const enabledPageProps = {
  sections: [
    {
      name: 'RecommendationShelf',
      data: { enableRecommendations: true },
    },
  ],
}

const multipleEnabledShelvesPageProps = {
  sections: [
    {
      name: 'RecommendationShelf',
      data: { enableRecommendations: true, campaignVrn: 'vrn:a' },
    },
    {
      name: 'RecommendationShelf',
      data: { enableRecommendations: true, campaignVrn: 'vrn:b' },
    },
    {
      name: 'ProductShelf',
      data: {},
    },
  ],
}

const disabledPageProps = {
  sections: [
    {
      name: 'RecommendationShelf',
      data: { enableRecommendations: false },
    },
  ],
}

beforeEach(() => {
  resetStartRecommendationSessionLock()
  useLazyQueryMock.mockReturnValue([runStartRecommendationSession, {}])
  runStartRecommendationSession.mockResolvedValue(true)
})

afterEach(() => {
  vi.clearAllMocks()
})

describe('useStartRecommendationSession', () => {
  it('does not start a session when no RecommendationShelf is enabled in CMS', async () => {
    getCookie.mockReturnValue(undefined)

    renderHook(() => useStartRecommendationSession(disabledPageProps))

    await waitFor(() => {
      expect(runStartRecommendationSession).not.toHaveBeenCalled()
    })
  })

  it('does not start a session when page props are missing', async () => {
    getCookie.mockReturnValue(undefined)

    renderHook(() => useStartRecommendationSession())

    await waitFor(() => {
      expect(runStartRecommendationSession).not.toHaveBeenCalled()
    })
  })

  it('does not start a session when the session cookie already exists', async () => {
    getCookie.mockReturnValue('already-started')

    renderHook(() => useStartRecommendationSession(enabledPageProps))

    await waitFor(() => {
      expect(runStartRecommendationSession).not.toHaveBeenCalled()
    })
  })

  it('starts a session when CMS enableRecommendations is true and no session cookie is present', async () => {
    getCookie.mockReturnValue(undefined)

    renderHook(() => useStartRecommendationSession(enabledPageProps))

    await waitFor(() => {
      expect(runStartRecommendationSession).toHaveBeenCalledTimes(1)
    })
  })

  it('starts a session only once when the page has multiple enabled RecommendationShelves', async () => {
    getCookie.mockReturnValue(undefined)

    const { rerender } = renderHook(
      ({ pageProps }) => useStartRecommendationSession(pageProps),
      { initialProps: { pageProps: multipleEnabledShelvesPageProps } }
    )

    // Simulate Layout re-renders caused by multiple shelves updating.
    rerender({ pageProps: multipleEnabledShelvesPageProps })
    rerender({ pageProps: multipleEnabledShelvesPageProps })

    await waitFor(() => {
      expect(runStartRecommendationSession).toHaveBeenCalledTimes(1)
    })
  })

  it('does not start a second session when the hook mounts again without a cookie', async () => {
    getCookie.mockReturnValue(undefined)

    renderHook(() => useStartRecommendationSession(enabledPageProps))

    await waitFor(() => {
      expect(runStartRecommendationSession).toHaveBeenCalledTimes(1)
    })

    renderHook(() => useStartRecommendationSession(enabledPageProps))

    await waitFor(() => {
      expect(runStartRecommendationSession).toHaveBeenCalledTimes(1)
    })
  })
})
