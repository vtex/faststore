import { beforeEach, describe, expect, it, vi } from 'vitest'

const { requestMock, useSWRMock } = vi.hoisted(() => ({
  requestMock: vi.fn(),
  // Returns the SWR config so the test can call the fetcher directly.
  useSWRMock: vi.fn((_key: unknown, config: unknown) => config),
}))

vi.mock('swr', () => ({ default: useSWRMock }))
vi.mock('../../../src/sdk/graphql/request', () => ({ request: requestMock }))

import { useQuery } from '../../../src/sdk/graphql/useQuery'

type Fetcher = () => Promise<unknown>

const operation = { __meta__: { operationName: 'TestQuery' } }

const getFetcher = () =>
  (useQuery(operation, {}) as unknown as { fetcher: Fetcher }).fetcher

// Fails the test instead of hanging when the fetcher promise never settles.
const settleWithin = (promise: Promise<unknown>, ms = 1000) =>
  Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error('fetcher did not settle')), ms)
    ),
  ])

describe('useQuery fetcher', () => {
  beforeEach(() => {
    requestMock.mockReset()
  })

  it('resolves with the request data', async () => {
    requestMock.mockResolvedValue({ product: { id: '1' } })

    await expect(settleWithin(getFetcher()())).resolves.toEqual({
      product: { id: '1' },
    })
  })

  it('rejects with the request error instead of never settling', async () => {
    // `request` throws the first GraphQL error, which is a plain object.
    const graphqlError = { status: 500, message: 'upstream failure' }
    requestMock.mockRejectedValue(graphqlError)

    await expect(settleWithin(getFetcher()())).rejects.toBe(graphqlError)
  })
})
