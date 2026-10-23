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
    // Keeps rendering the static product, and does not retry the failed call.
    expect(result.current.data).toBe(fallbackData)
    expect(mockRequest).toHaveBeenCalledTimes(1)
  })

  it('does not retry a NotFoundError carried in the GraphQL extensions', async () => {
    mockUseSession.mockReturnValue({
      channel: '{"salesChannel":"1"}',
      locale: 'en-US',
      b2b: { customerId: 'contract-137' },
    })
    mockRequest.mockRejectedValue({ extensions: { type: 'NotFoundError' } })

    const fastRetries = ({ children }: { children: ReactNode }) =>
      createElement(
        SWRConfig,
        { value: { provider: () => new Map(), errorRetryInterval: 1 } },
        children
      )

    renderHook(usePdpClientQuery, { wrapper: fastRetries })

    await waitFor(() => expect(mockReplace).toHaveBeenCalledWith('/404'))
    // Long enough for a retry at the 1 ms interval to have run.
    await new Promise((resolve) => setTimeout(resolve, 50))
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
