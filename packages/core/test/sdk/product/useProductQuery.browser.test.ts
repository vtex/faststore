/**
 * @vitest-environment jsdom
 */

import { renderHook, waitFor } from '@testing-library/react'
import { createElement, type ReactNode } from 'react'
import { SWRConfig } from 'swr'
import { afterEach, describe, expect, it, vi } from 'vitest'

const mockRequest = vi.hoisted(() => vi.fn())
const mockReplace = vi.hoisted(() => vi.fn())
const mockUseSession = vi.hoisted(() => vi.fn())
const mockSharedRetry = vi.hoisted(() => vi.fn())

vi.mock('@generated', () => ({
  gql: () => ({
    __meta__: { operationName: 'ClientProductQuery', operationHash: 'hash' },
  }),
}))
vi.mock('src/sdk/graphql/request', () => ({ request: mockRequest }))
vi.mock('src/utils/cookieCacheBusting', () => ({
  getClientCacheBustingValue: () => null,
}))
vi.mock('src/sdk/session', () => ({ useSession: mockUseSession }))
// Spies on the shared retry policy while keeping its behavior. SWR calls
// `onErrorRetry` synchronously when the error lands, so whether a retry was
// scheduled is known without waiting on the clock.
vi.mock('src/sdk/graphql/retryPolicy', async (importOriginal) => {
  const actual =
    await importOriginal<typeof import('src/sdk/graphql/retryPolicy')>()
  mockSharedRetry.mockImplementation(actual.onErrorRetry)

  return { ...actual, onErrorRetry: mockSharedRetry }
})
vi.mock('next/router', () => ({
  useRouter: () => ({ replace: mockReplace }),
}))

import { useProductNotFoundRedirect } from '../../../src/sdk/product/useProductNotFoundRedirect'
import { useProductQuery } from '../../../src/sdk/product/useProductQuery'

const fallbackData = { product: { id: '123' } } as any

// The real PDP wiring: the refetch error feeds the redirect hook.
const usePdpClientQuery = () => {
  const productQuery = useProductQuery('123', fallbackData)
  useProductNotFoundRedirect(productQuery.error)

  return productQuery
}

// SWR's cache is global; isolate it so a test never reads another one's result.
const isolatedCache = ({ children }: { children: ReactNode }) =>
  createElement(SWRConfig, { value: { provider: () => new Map() } }, children)

describe('useProductQuery', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  it('exposes a failed refetch as `error` and stops validating', async () => {
    mockUseSession.mockReturnValue({
      channel: '{"salesChannel":"1"}',
      locale: 'en-US',
      b2b: null,
    })
    mockRequest.mockRejectedValue({ status: 404, message: 'Not Found' })

    const { result } = renderHook(usePdpClientQuery, { wrapper: isolatedCache })

    await waitFor(() => expect(result.current.error).toEqual(expect.anything()))

    expect(result.current.error).toMatchObject({ status: 404 })
    expect(result.current.isValidating).toBe(false)
    // The data stays the static product, and the failed call is not retried.
    expect(result.current.data).toBe(fallbackData)
    expect(mockRequest).toHaveBeenCalledTimes(1)
    // Shoppers without a B2B session are sent to the 404 page too.
    await waitFor(() => expect(mockReplace).toHaveBeenCalledWith('/404'))
  })

  it('does not retry a NotFoundError carried in the GraphQL extensions', async () => {
    mockUseSession.mockReturnValue({
      channel: '{"salesChannel":"1"}',
      locale: 'en-US',
      b2b: { customerId: 'contract-137' },
    })
    mockRequest.mockRejectedValue({ extensions: { type: 'NotFoundError' } })

    renderHook(usePdpClientQuery, { wrapper: isolatedCache })

    await waitFor(() => expect(mockReplace).toHaveBeenCalledWith('/404'))
    // The shared policy is what schedules a retry; it is never reached.
    expect(mockSharedRetry).not.toHaveBeenCalled()
    expect(mockRequest).toHaveBeenCalledTimes(1)
  })

  it('sends a B2B shopper to the 404 page when the refetch answers 404', async () => {
    mockUseSession.mockReturnValue({
      channel: '{"salesChannel":"1"}',
      locale: 'en-US',
      b2b: { customerId: 'contract-137' },
    })
    mockRequest.mockRejectedValue({ status: 404, message: 'Not Found' })

    renderHook(usePdpClientQuery, { wrapper: isolatedCache })

    await waitFor(() => expect(mockReplace).toHaveBeenCalledWith('/404'))
  })

  it('retries a transient failure instead of treating it as not found', async () => {
    mockUseSession.mockReturnValue({
      channel: '{"salesChannel":"1"}',
      locale: 'en-US',
      b2b: { customerId: 'contract-137' },
    })
    const fresh = { product: { id: '123', name: 'Fresh' } }
    mockRequest
      .mockRejectedValueOnce({ status: 500, message: 'Internal Server Error' })
      .mockResolvedValue(fresh)

    const fastRetries = ({ children }: { children: ReactNode }) =>
      createElement(
        SWRConfig,
        { value: { provider: () => new Map(), errorRetryInterval: 1 } },
        children
      )

    const { result } = renderHook(usePdpClientQuery, { wrapper: fastRetries })

    await waitFor(() => expect(result.current.data).toEqual(fresh))

    expect(mockRequest).toHaveBeenCalledTimes(2)
    expect(mockSharedRetry).toHaveBeenCalledTimes(1)
    expect(mockReplace).not.toHaveBeenCalled()
  })

  it('keeps the product and does not redirect when the refetch succeeds', async () => {
    mockUseSession.mockReturnValue({
      channel: '{"salesChannel":"1"}',
      locale: 'en-US',
      b2b: { customerId: 'contract-137' },
    })
    const fresh = { product: { id: '123', name: 'Fresh' } }
    mockRequest.mockResolvedValue(fresh)

    const { result } = renderHook(usePdpClientQuery, { wrapper: isolatedCache })

    await waitFor(() => expect(result.current.data).toEqual(fresh))

    expect(result.current.error).toBeUndefined()
    expect(mockReplace).not.toHaveBeenCalled()
  })
})
