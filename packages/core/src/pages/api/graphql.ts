import { isFastStoreError } from '@faststore/api'
import type { NextApiHandler, NextApiRequest } from 'next'

import { execute } from '../../server'

const parseRequest = (request: NextApiRequest) => {
  const { operationName, variables, query } =
    request.method === 'POST'
      ? request.body
      : {
          operationName: request.query.operationName,
          variables: JSON.parse(
            typeof request.query.variables === 'string'
              ? request.query.variables
              : ''
          ),
          query: undefined,
        }

  return {
    operationName,
    variables,
    // Do not allow queries in production, only for devMode so we can use graphql tools
    // like introspection etc. In production, we only accept known queries for better
    // security
    query: process.env.NODE_ENV !== 'production' ? query : undefined,
  }
}

const handler: NextApiHandler = async (request, response) => {
  if (request.method !== 'POST' && request.method !== 'GET') {
    response.status(405)

    return
  }

  const { operationName, variables, query } = parseRequest(request)

  try {
    const result = await execute(
      {
        operationName,
        variables,
        query,
      },
      { req: request }
    )

    if (Array.isArray(result.errors)) {
      const error = result.errors.find(isFastStoreError)

      response.status(error?.extensions.status ?? 500)
    }

    response.setHeader('cache-control', 'no-cache, no-store')
    response.setHeader('content-type', 'application/json')
    response.send(JSON.stringify(result))
  } catch (err) {
    console.error(err)

    response.status(500)
  }
}

export default handler
