import { afterEach, describe, expect, it, vi } from 'vitest'

const useSWRMock = vi.hoisted(() => vi.fn())
vi.mock('swr', () => ({ default: useSWRMock }))

const requestMock = vi.hoisted(() => vi.fn())
vi.mock('src/components/RecommendationShelf/queries/request', () => ({
  request: requestMock,
}))

import {
  getKey,
  useQuery,
} from 'src/components/RecommendationShelf/queries/useQuery'
import { useLazyQuery } from 'src/components/RecommendationShelf/queries/useLazyQuery'

const op = { __meta__: { operationName: 'FooQuery', operationHash: 'h1' } }

afterEach(() => {
  vi.clearAllMocks()
})

describe('getKey', () => {
  it('combines the operation name and serialized variables', () => {
    expect(getKey('FooQuery', { a: 1 })).toBe('FooQuery::{"a":1}')
  })
})

describe('useQuery', () => {
  it('builds a key from the operation name when run is enabled', () => {
    useQuery(op, { a: 1 }, { doNotRun: false })

    const keyFn = useSWRMock.mock.calls[0][0]
    expect(keyFn()).toBe('FooQuery::{"a":1}')
  })

  it('returns a null key when doNotRun is set', () => {
    useQuery(op, { a: 1 }, { doNotRun: true })

    const keyFn = useSWRMock.mock.calls[0][0]
    expect(keyFn()).toBeNull()
  })

  it('falls back to an empty operation name without __meta__', () => {
    useQuery({}, { a: 1 })

    const keyFn = useSWRMock.mock.calls[0][0]
    expect(keyFn()).toBe('::{"a":1}')
  })
})

describe('useLazyQuery', () => {
  it('executes the request lazily and updates the SWR cache', async () => {
    const mutate = vi.fn(async (data: unknown) => data)
    useSWRMock.mockReturnValue({ mutate })
    requestMock.mockResolvedValue({ ok: true })

    const [execute] = useLazyQuery(op, {})
    const result = await execute({ id: '1' })

    expect(requestMock).toHaveBeenCalledWith(op, { id: '1' }, undefined)
    expect(mutate).toHaveBeenCalledWith({ ok: true }, false)
    expect(result).toEqual({ ok: true })
  })
})
