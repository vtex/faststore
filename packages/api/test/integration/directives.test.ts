import { mergeTypeDefs } from '@graphql-tools/merge'
import { makeExecutableSchema } from '@graphql-tools/schema'
import type { GraphQLSchema } from 'graphql'
import { execute, parse } from 'graphql'
import { beforeEach, describe, expect, test, vi } from 'vitest'

import { GraphqlVtexSchema, UnauthorizedError } from '../../src'

const storeTypeDefs = /* GraphQL */ `
  type ProbeObject {
    secret: String @auth
  }

  extend type Query {
    probeAuth: String @auth
    probeCache: String
      @cacheControl(scope: "private", sMaxAge: 7, staleWhileRevalidate: 11)
    probeAuthCache: String
      @auth
      @cacheControl(scope: "private", sMaxAge: 7, staleWhileRevalidate: 11)
    probeObject: ProbeObject
  }
`

const storeResolvers = {
  Query: {
    probeAuth: vi.fn(() => 'auth-ok'),
    probeCache: vi.fn(() => 'cache-ok'),
    probeAuthCache: vi.fn(() => 'auth-cache-ok'),
    probeObject: vi.fn(() => ({ secret: 'parent-value' })),
  },
}

const validate = vi.fn()

/** Builds the final schema the same way `getFinalAPISchema` does in `@faststore/core`. */
const buildStoreSchema = () => {
  const storeSchema = makeExecutableSchema({
    typeDefs: mergeTypeDefs([GraphqlVtexSchema(), storeTypeDefs]),
    resolvers: storeResolvers,
  })

  return GraphqlVtexSchema(storeSchema)
}

const createRunner =
  (schema: GraphQLSchema) =>
  async (query: string, { authenticated }: { authenticated: boolean }) => {
    validate.mockResolvedValue({
      authStatus: authenticated ? 'Success' : 'Failed',
    })

    const ctx: Record<string, any> = {
      OTEL_ENABLED: false,
      account: 'storeframework',
      headers: {},
      clients: { commerce: { vtexid: { validate } } },
    }

    const result = await execute({
      schema,
      document: parse(query),
      contextValue: ctx,
    })

    return { result, ctx }
  }

beforeEach(() => {
  vi.clearAllMocks()
})

describe('directives on store schema extensions', () => {
  const run = createRunner(buildStoreSchema())

  test('@auth rejects unauthenticated callers without running the store resolver', async () => {
    const { result } = await run('{ probeAuth }', { authenticated: false })

    expect(result.errors?.[0]?.originalError).toBeInstanceOf(UnauthorizedError)
    expect(result.data?.probeAuth).toBeNull()
    expect(storeResolvers.Query.probeAuth).not.toHaveBeenCalled()
    expect(validate).toHaveBeenCalledTimes(1)
  })

  test('@auth runs the store resolver for authenticated callers', async () => {
    const { result } = await run('{ probeAuth }', { authenticated: true })

    expect(result.errors).toBeUndefined()
    expect(result.data?.probeAuth).toBe('auth-ok')
    expect(validate).toHaveBeenCalledTimes(1)
  })

  test('@auth on a field without resolver returns the parent value once authorized', async () => {
    const authorized = await run('{ probeObject { secret } }', {
      authenticated: true,
    })

    expect(authorized.result.errors).toBeUndefined()
    expect(authorized.result.data?.probeObject).toEqual({
      secret: 'parent-value',
    })

    const unauthorized = await run('{ probeObject { secret } }', {
      authenticated: false,
    })

    expect(unauthorized.result.errors?.[0]?.originalError).toBeInstanceOf(
      UnauthorizedError
    )
    expect(unauthorized.result.data?.probeObject).toEqual({ secret: null })
  })

  test('@cacheControl contributes the store field policy', async () => {
    const { result, ctx } = await run('{ probeCache }', {
      authenticated: false,
    })

    expect(result.errors).toBeUndefined()
    expect(result.data?.probeCache).toBe('cache-ok')
    expect(ctx.cacheControl).toEqual({
      scope: 'private',
      sMaxAge: 7,
      staleWhileRevalidate: 11,
    })
  })

  test('@cacheControl aggregates store and native policies', async () => {
    const { result, ctx } = await run(
      '{ validateUser { isValid } probeCache }',
      { authenticated: true }
    )

    expect(result.errors).toBeUndefined()
    expect(ctx.cacheControl).toEqual({
      scope: 'private',
      sMaxAge: 7,
      staleWhileRevalidate: 11,
    })
  })

  test('@auth runs before @cacheControl on the same field', async () => {
    const { result, ctx } = await run('{ probeAuthCache }', {
      authenticated: false,
    })

    expect(result.errors?.[0]?.originalError).toBeInstanceOf(UnauthorizedError)
    expect(storeResolvers.Query.probeAuthCache).not.toHaveBeenCalled()
    expect(ctx.cacheControl).toBeUndefined()
  })
})

describe('directives on native fields', () => {
  describe.each([
    ['merged with a store schema', buildStoreSchema],
    ['without a store schema', () => GraphqlVtexSchema()],
  ])('%s', (_, build) => {
    const run = createRunner(build())

    test('keep the native resolver and validate the session exactly once', async () => {
      const { result, ctx } = await run('{ validateUser { isValid } }', {
        authenticated: true,
      })

      expect(result.errors).toBeUndefined()
      expect(result.data?.validateUser).toEqual({ isValid: true })
      expect(validate).toHaveBeenCalledTimes(1)
      expect(ctx.cacheControl).toEqual({
        scope: 'private',
        sMaxAge: 300,
        staleWhileRevalidate: 3600,
      })
    })

    test('reject unauthenticated callers', async () => {
      const { result } = await run('{ validateUser { isValid } }', {
        authenticated: false,
      })

      expect(result.errors?.[0]?.originalError).toBeInstanceOf(
        UnauthorizedError
      )
      expect(result.data?.validateUser).toBeNull()
    })
  })
})
