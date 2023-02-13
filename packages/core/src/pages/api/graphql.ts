import { isFastStoreError, stringifyCacheControl } from '@faststore/api'
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
    const { data, errors, extensions } = await execute(
      {
        operationName,
        variables,
        query,
      },
      { headers: request.headers }
    )

    const hasErrors = Array.isArray(errors)

    if (hasErrors) {
      const error = errors.find(isFastStoreError)

      response.status(error?.extensions.status ?? 500)
    }

    const cacheControl =
      !hasErrors && extensions.cacheControl
        ? stringifyCacheControl(extensions.cacheControl)
        : 'no-cache, no-store'

    response.setHeader('cache-control', cacheControl)
    response.setHeader('content-type', 'application/json')
    response.send(JSON.stringify({ data, errors }))
  } catch (err) {
    console.error(err)

    response.status(500)
  }
}

export default handler
