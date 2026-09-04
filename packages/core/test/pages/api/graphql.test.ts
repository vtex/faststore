import {
  BadRequestError,
  FastStoreError,
  ForbiddenError,
  NotFoundError,
  UnauthorizedError,
} from '@faststore/api'
import { GraphQLError } from 'graphql'
import type { NextApiRequest, NextApiResponse } from 'next'

import handler from '../../../src/pages/api/graphql'
import { execute } from '../../../src/server'

jest.mock('../../../src/server', () => ({
  execute: jest.fn(),
}))

const mockedExecute = jest.mocked(execute)

const ORIGINAL_NODE_ENV = process.env.NODE_ENV

const setNodeEnv = (value: string | undefined) => {
  ;(process.env as Record<string, string | undefined>).NODE_ENV = value
}

const createResponse = () => {
  const res = {
    status: jest.fn().mockReturnThis(),
    setHeader: jest.fn().mockReturnThis(),
    send: jest.fn().mockReturnThis(),
    end: jest.fn().mockReturnThis(),
  }

  return res as unknown as NextApiResponse & typeof res
}

const createRequest = (operationName = 'ClientShippingSimulationQuery') =>
  ({
    method: 'GET',
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
// graphql@15 exposes `originalError` as the 6th positional constructor arg.
const maskedError = (original: FastStoreError) =>
  new GraphQLError(
    original.message,
    undefined,
    undefined,
    undefined,
    undefined,
    original
  )

describe('/api/graphql error status propagation', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  afterEach(() => {
    setNodeEnv(ORIGINAL_NODE_ENV)
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
  })

  it('exposes type, status and message in the body outside production', async () => {
    setNodeEnv('development')
    mockExecuteWithErrors([maskedError(new BadRequestError('invalid CEP'))])

    const res = createResponse()
    await handler(createRequest(), res)

    const body = JSON.parse((res.send as jest.Mock).mock.calls[0][0])
    expect(body.errors[0]).toEqual({
      extensions: { type: 'BadRequestError', status: 400 },
      message: 'invalid CEP',
    })
  })

  it('omits the free-text message from the body in production', async () => {
    setNodeEnv('production')
    mockExecuteWithErrors([maskedError(new BadRequestError('invalid CEP'))])

    const res = createResponse()
    await handler(createRequest(), res)

    const body = JSON.parse((res.send as jest.Mock).mock.calls[0][0])
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

  it('treats an empty errors array as success instead of a 500', async () => {
    mockedExecute.mockResolvedValue({
      data: { product: { id: '1' } },
      errors: [],
      extensions: { cookies: new Map(), cacheControl: undefined },
    } as never)

    const res = createResponse()
    await handler(createRequest(), res)

    expect(res.status).not.toHaveBeenCalled()
    expect(res.send).toHaveBeenCalledWith(
      JSON.stringify({ data: { product: { id: '1' } }, errors: [] })
    )
  })
})
