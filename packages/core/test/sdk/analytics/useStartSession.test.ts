/**
 * @vitest-environment jsdom
 */

import { renderHook, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('@faststore/core/api', () => ({
  gql: (s: string) => ({ __meta__: {}, query: s }),
}))

const runStartSession = vi.hoisted(() => vi.fn())
const runSendProductViewEvent = vi.hoisted(() => vi.fn())
const useLazyQueryMock = vi.hoisted(() => vi.fn())
vi.mock('src/components/RecommendationShelf/queries/useLazyQuery', () => ({
  useLazyQuery: useLazyQueryMock,
}))

const checkIsMobile = vi.hoisted(() => vi.fn())
const getUserIdFromCookie = vi.hoisted(() => vi.fn())
vi.mock('src/components/RecommendationShelf/utils', () => ({
  checkIsMobile,
  getUserIdFromCookie,
}))

const getCookie = vi.hoisted(() => vi.fn())
vi.mock('src/utils/getCookie', () => ({ getCookie }))

import { useStartSession } from 'src/sdk/analytics/hooks/useStartSession'

const pdpProps = {
  data: { product: { isVariantOf: { productGroupID: 'p-1' } } },
}

beforeEach(() => {
  useLazyQueryMock.mockImplementation((operation: { query: string }) => {
    if (operation.query.includes('sendProductViewEvent')) {
      return [runSendProductViewEvent, {}]
    }
    return [runStartSession, {}]
  })
  runStartSession.mockResolvedValue(true)
  runSendProductViewEvent.mockResolvedValue(true)
  checkIsMobile.mockReturnValue(false)
  getUserIdFromCookie.mockReturnValue('user-1')
})

afterEach(() => {
  vi.clearAllMocks()
})

describe('useStartSession', () => {
  it('does not start a session when the session cookie already exists', async () => {
    getCookie.mockReturnValue('already-started')

    renderHook(() => useStartSession())

    await waitFor(() => {
      expect(runStartSession).not.toHaveBeenCalled()
    })
  })

  it('starts a session when no session cookie is present', async () => {
    getCookie.mockReturnValue(undefined)

    renderHook(() => useStartSession())

    await waitFor(() => {
      expect(runStartSession).toHaveBeenCalled()
    })
  })

  it('sends a product view for a PDP with a known user (desktop)', async () => {
    getCookie.mockReturnValue('already-started')

    renderHook(() => useStartSession(pdpProps))

    await waitFor(() => {
      expect(runSendProductViewEvent).toHaveBeenCalledWith({
        userId: 'user-1',
        product: 'p-1',
        source: 'WEB_DESKTOP',
      })
    })
  })

  it('uses the mobile source on small viewports', async () => {
    getCookie.mockReturnValue('already-started')
    checkIsMobile.mockReturnValue(true)

    renderHook(() => useStartSession(pdpProps))

    await waitFor(() => {
      expect(runSendProductViewEvent).toHaveBeenCalledWith(
        expect.objectContaining({ source: 'WEB_MOBILE' })
      )
    })
  })

  it('does not send a product view when there is no product', async () => {
    getCookie.mockReturnValue('already-started')

    renderHook(() => useStartSession({ data: {} }))

    await waitFor(() => {
      expect(runStartSession).not.toHaveBeenCalled()
    })
    expect(runSendProductViewEvent).not.toHaveBeenCalled()
  })

  it('does not send a product view when the user is unknown', async () => {
    getCookie.mockReturnValue('already-started')
    getUserIdFromCookie.mockReturnValue('')

    renderHook(() => useStartSession(pdpProps))

    await waitFor(() => {
      expect(getUserIdFromCookie).toHaveBeenCalled()
    })
    expect(runSendProductViewEvent).not.toHaveBeenCalled()
  })

  it('swallows product-view mutation failures', async () => {
    getCookie.mockReturnValue('already-started')
    runSendProductViewEvent.mockRejectedValue(new Error('network'))

    renderHook(() => useStartSession(pdpProps))

    await waitFor(() => {
      expect(runSendProductViewEvent).toHaveBeenCalledTimes(1)
    })
  })

  it('does not re-send the same product view across re-renders', async () => {
    getCookie.mockReturnValue('already-started')

    const { rerender } = renderHook(() => useStartSession(pdpProps))

    await waitFor(() => {
      expect(runSendProductViewEvent).toHaveBeenCalledTimes(1)
    })

    rerender()

    expect(runSendProductViewEvent).toHaveBeenCalledTimes(1)
  })
})
