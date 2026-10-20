import {
  BadRequestError,
  FastStoreError,
  ForbiddenError,
  NotFoundError,
  UnauthorizedError,
} from '@faststore/api'
import { GraphQLError } from 'graphql'
import type { NextApiRequest, NextApiResponse } from 'next'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import discoveryConfig from '../../../discovery.config'
import handler from '../../../src/pages/api/graphql'
import { execute } from '../../../src/server'
import { shouldForceRefreshTokenForValidateSession } from '../../../src/utils/validateSessionRefreshToken'

vi.mock('../../../src/server', () => ({
  execute: vi.fn(),
}))

vi.mock('../../../src/utils/validateSessionRefreshToken', () => ({
  shouldForceRefreshTokenForValidateSession: vi.fn(),
}))

const mockedExecute = vi.mocked(execute)
const mockedShouldForceRefreshToken = vi.mocked(
  shouldForceRefreshTokenForValidateSession
)

const createResponse = ({ headersSent = false } = {}) => {
  const res = {
    status: vi.fn().mockReturnThis(),
    setHeader: vi.fn().mockReturnThis(),
    send: vi.fn().mockReturnThis(),
    end: vi.fn().mockReturnThis(),
    headersSent,
  }

  return res as unknown as NextApiResponse & typeof res
}

const createRequest = (
  operationName = 'ClientShippingSimulationQuery',
  method = 'GET'
) =>
  ({
    method,
    url: '/api/graphql',
    headers: { host: 'localhost:3000' },
    query: {
      operationName,
      operationHash: 'hash',
      variables: '{}',
    },
  }) as unknown as NextApiRequest

const mockExecuteWithErrors = (errors: unknown[]) => {
  mockedExecute.mockResolvedValue({
    data: null,
    errors,
    extensions: { cookies: new Map(), cacheControl: undefined },
  } as never)
}

// Reproduces what `useMaskedErrors` produces: a GraphQLError whose
// `originalError` is the FastStoreError thrown by a resolver/`fetchAPI`.
const maskedError = (original: FastStoreError) =>
  new GraphQLError(original.message, { originalError: original })

describe('/api/graphql error status propagation', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.unstubAllEnvs()
  })

  it('propagates the upstream 400 from a wrapped BadRequestError instead of 500', async () => {
    mockExecuteWithErrors([
      maskedError(new BadRequestError('O campo CEP (88) é inválido')),
    ])

    const res = createResponse()
    await handler(createRequest(), res)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.end).not.toHaveBeenCalled()
  })

  it.each([
    ['UnauthorizedError', () => new UnauthorizedError('nope'), 401],
    ['ForbiddenError', () => new ForbiddenError('nope'), 403],
    ['NotFoundError', () => new NotFoundError('nope'), 404],
  ])('propagates %s status', async (_name, makeError, expectedStatus) => {
    mockExecuteWithErrors([maskedError(makeError())])

    const res = createResponse()
    await handler(createRequest(), res)

    expect(res.status).toHaveBeenCalledWith(expectedStatus)
  })

  it('propagates an unmapped upstream status (UnknownError 429)', async () => {
    mockExecuteWithErrors([
      maskedError(
        new FastStoreError({ status: 429, type: 'UnknownError' }, 'slow down')
      ),
    ])

    const res = createResponse()
    await handler(createRequest(), res)

    expect(res.status).toHaveBeenCalledWith(429)
  })

  it('recovers status when the error itself is a FastStoreError (not wrapped)', async () => {
    mockExecuteWithErrors([new BadRequestError('bad input')])

    const res = createResponse()
    await handler(createRequest(), res)

    expect(res.status).toHaveBeenCalledWith(400)
  })

  it('falls back to a body-less 500 for non-FastStore errors', async () => {
    mockExecuteWithErrors([new GraphQLError('Sorry, something went wrong.')])

    const res = createResponse()
    await handler(createRequest(), res)

    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.end).toHaveBeenCalled()
    expect(res.send).not.toHaveBeenCalled()
    expect(res.setHeader).toHaveBeenCalledWith('cache-control', 'no-store')
  })

  it('exposes type, status and message in the body outside production', async () => {
    vi.stubEnv('NODE_ENV', 'development')
    mockExecuteWithErrors([maskedError(new BadRequestError('invalid CEP'))])

    const res = createResponse()
    await handler(createRequest(), res)

    const body = JSON.parse(
      (res.send as ReturnType<typeof vi.fn>).mock.calls[0][0]
    )
    expect(body.errors[0]).toEqual({
      extensions: { type: 'BadRequestError', status: 400 },
      message: 'invalid CEP',
    })
  })

  it('omits the free-text message from the body in production', async () => {
    vi.stubEnv('NODE_ENV', 'production')
    mockExecuteWithErrors([maskedError(new BadRequestError('invalid CEP'))])

    const res = createResponse()
    await handler(createRequest(), res)

    const body = JSON.parse(
      (res.send as ReturnType<typeof vi.fn>).mock.calls[0][0]
    )
    expect(body.errors[0]).toEqual({
      extensions: { type: 'BadRequestError', status: 400 },
    })
    expect(body.errors[0].message).toBeUndefined()
  })

  it('uses the first recoverable FastStoreError when several errors exist', async () => {
    mockExecuteWithErrors([
      new GraphQLError('plain error'),
      maskedError(new NotFoundError('missing')),
      maskedError(new BadRequestError('bad')),
    ])

    const res = createResponse()
    await handler(createRequest(), res)

    expect(res.status).toHaveBeenCalledWith(404)
  })

  it('sets cache-control: no-store on error responses so a bare 404/410 is not cached by intermediaries', async () => {
    mockExecuteWithErrors([maskedError(new NotFoundError('missing'))])

    const res = createResponse()
    await handler(createRequest(), res)

    expect(res.setHeader).toHaveBeenCalledWith('cache-control', 'no-store')
  })
})

describe('/api/graphql request handling', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it.each(['PUT', 'DELETE', 'PATCH', 'OPTIONS'])(
    'rejects %s with 405 without reaching the GraphQL layer',
    async (method) => {
      const res = createResponse()
      await handler(createRequest(undefined, method), res)

      expect(res.status).toHaveBeenCalledWith(405)
      expect(mockedExecute).not.toHaveBeenCalled()
    }
  )

  it.each([
    ['BadRequestError', () => new BadRequestError('malformed'), 400],
    ['UnauthorizedError', () => new UnauthorizedError('expired'), 401],
    ['an unexpected failure', () => new Error('socket hang up'), 500],
  ])(
    'maps %s thrown by execute to its status',
    async (_name, makeError, status) => {
      mockedExecute.mockRejectedValue(makeError())

      const res = createResponse()
      await handler(createRequest(), res)

      expect(res.status).toHaveBeenCalledWith(status)
      expect(res.end).toHaveBeenCalled()
      expect(res.setHeader).toHaveBeenCalledWith('cache-control', 'no-store')
    }
  )

  it('skips the cache-control header when headers were already sent', async () => {
    mockedExecute.mockRejectedValue(new Error('boom after flush'))

    const res = createResponse({ headersSent: true })
    await handler(createRequest(), res)

    expect(res.setHeader).not.toHaveBeenCalledWith(
      'cache-control',
      expect.anything()
    )
    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.end).toHaveBeenCalled()
  })
})

describe('/api/graphql ValidateSession refresh-token bypass', () => {
  const originalRefreshToken = discoveryConfig.experimental.refreshToken

  const createValidateSessionRequest = (host: string) =>
    ({
      method: 'GET',
      url: '/api/graphql',
      headers: { host },
      query: {
        operationName: 'ValidateSession',
        operationHash: 'hash',
        variables: JSON.stringify({ session: {} }),
      },
    }) as unknown as NextApiRequest

  beforeEach(() => {
    vi.clearAllMocks()
    discoveryConfig.experimental.refreshToken = true
    mockedShouldForceRefreshToken.mockReturnValue(true)
    mockedExecute.mockResolvedValue({
      data: { validateSession: null },
      errors: undefined,
      extensions: { cookies: new Map(), cacheControl: undefined },
    } as never)
  })

  afterEach(() => {
    discoveryConfig.experimental.refreshToken = originalRefreshToken
  })

  it.each([
    'localhost:3000',
    '127.0.0.1:3000',
    'brandless-abc123.preview.vtex.app',
  ])('does not force a 401 on %s', async (host) => {
    const res = createResponse()
    await handler(createValidateSessionRequest(host), res)

    expect(mockedShouldForceRefreshToken).not.toHaveBeenCalled()
    expect(res.status).not.toHaveBeenCalledWith(401)
    expect(mockedExecute).toHaveBeenCalled()
  })

  it.each(['brandless.vtex.app', 'brandless.fast.store'])(
    'forces a 401 on the production host %s',
    async (host) => {
      const res = createResponse()
      await handler(createValidateSessionRequest(host), res)

      expect(res.status).toHaveBeenCalledWith(401)
      expect(mockedExecute).not.toHaveBeenCalled()
    }
  )
})
