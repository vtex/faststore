import { stringifyCacheControl } from '@faststore/api'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { execute } from '../../src/server'

const probeResolvers = vi.hoisted(() => ({
  Query: {
    probeAuth: vi.fn(() => 'auth-ok'),
    probeCache: vi.fn(() => 'cache-ok'),
  },
}))

const fetchMock = vi.hoisted(() => vi.fn())

vi.mock('../../src/customizations/src/graphql/thirdParty/resolvers', () => ({
  default: probeResolvers,
}))

vi.mock('isomorphic-unfetch', () => ({
  default: (...args: unknown[]) => fetchMock(...args),
}))

vi.mock('@graphql-tools/load-files', () => ({
  loadFilesSync: () => [
    /* GraphQL */ `
      extend type Query {
        probeAuth: String @auth
        probeCache: String
          @cacheControl(scope: "private", sMaxAge: 7, staleWhileRevalidate: 11)
      }
    `,
  ],
}))

const operation = (operationName: string, query: string) => ({
  variables: {},
  query,
  operation: {
    __meta__: { operationName, operationHash: operationName },
  },
})

describe('store directives through the core server', () => {
  beforeEach(() => {
    probeResolvers.Query.probeAuth.mockClear()
    probeResolvers.Query.probeCache.mockClear()
    fetchMock.mockReset()
    fetchMock.mockResolvedValue({
      ok: false,
      status: 401,
      statusText: 'Unauthorized',
      headers: new Headers(),
      text: async () => 'unauthorized',
      json: async () => ({}),
    })
  })

  it('applies @cacheControl from a store field to the response extensions', async () => {
    const result = await execute(
      operation('ProbeCacheQuery', 'query ProbeCacheQuery { probeCache }')
    )

    expect(result.errors).toBeUndefined()
    expect(result.data).toEqual({ probeCache: 'cache-ok' })
    expect(result.extensions.cacheControl).toEqual({
      scope: 'private',
      sMaxAge: 7,
      staleWhileRevalidate: 11,
    })
    expect(
      stringifyCacheControl(result.extensions.cacheControl ?? {}, false)
    ).toBe('private, s-maxage=7, stale-while-revalidate=11')
  })

  it('applies @auth from a store field and validates the session once', async () => {
    const result = await execute(
      operation('ProbeAuthQuery', 'query ProbeAuthQuery { probeAuth }')
    )

    expect(result.data).toEqual({ probeAuth: null })
    expect(result.errors?.length).toBeGreaterThan(0)
    expect(probeResolvers.Query.probeAuth).not.toHaveBeenCalled()
    expect(
      fetchMock.mock.calls.filter(([url]) =>
        String(url).includes('/api/vtexid/credential/validate')
      )
    ).toHaveLength(1)
  })
})
