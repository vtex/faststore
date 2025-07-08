import {
  BadRequestError,
  UnauthorizedError,
  isFastStoreError,
  stringifyCacheControl,
} from '@faststore/api'
import type { NextApiHandler, NextApiRequest } from 'next'

import discoveryConfig from 'discovery.config'
import { getJWTAutCookie } from 'src/utils/getCookie'
import { execute } from '../../server'

const ONE_MINUTE = 60

/**
 * This function replaces the setCookie domain so that we can use localhost in dev environment.
 *
 * @param request NextApiRequest
 * @param setCookie setCookie string that comes from FastStore API
 * @returns setCookie string with it domains replace
 */
const replaceSetCookieDomain = (request: NextApiRequest, setCookie: string) => {
  const MATCH_DOMAIN_REGEXP = /(?:^|;\s*)(?:domain=)([^;]+)/i
  const faststoreAPIHostname = new URL(`https://${request.headers.host}`)
    .hostname

  // Replaces original cookie domain for FastStore API's domain hostname
  return setCookie.replace(
    MATCH_DOMAIN_REGEXP,
    `; domain=${faststoreAPIHostname}`
  )
}

const parseRequest = (request: NextApiRequest) => {
  try {
    const { operationName, operationHash, variables, query } =
      request.method === 'POST'
        ? request.body
        : {
            operationName: request.query.operationName,
            operationHash: request.query.operationHash,
            variables: JSON.parse(
              typeof request.query.variables === 'string'
                ? request.query.variables
                : ''
            ),
            query: undefined,
          }

    return {
      operation: {
        __meta__: {
          operationName,
          operationHash,
        },
      },
      variables,
      // Do not allow queries in production, only for devMode so we can use graphql tools
      // like introspection etc. In production, we only accept known queries for better
      // security
      query: process.env.NODE_ENV !== 'production' ? query : undefined,
    }
  } catch (error) {
    throw new BadRequestError(
      `Invalid request. Please check the request. ${error}`
    )
  }
}

function isTokenExpired(exp: number): boolean {
  const now = Math.floor(Date.now() / 1000)
  return exp < now
}

// let firstTokenCheck = true

const handler: NextApiHandler = async (request, response) => {
  if (request.method !== 'POST' && request.method !== 'GET') {
    response.status(405).end()

    return
  }

  try {
    const { operation, variables, query } = parseRequest(request)

    if (
      operation.__meta__.operationName === 'ValidateSession' &&
      discoveryConfig.experimental?.refreshToken
    ) {
      const jwt = getJWTAutCookie({
        headers: request.headers,
        account: discoveryConfig.api.storeId,
      })
      console.log('🚀 ~ jwt:', jwt)

      const tokenExpired = jwt && isTokenExpired(jwt?.exp)
      console.log('🚀 ~ tokenExpired:', tokenExpired)
      if (tokenExpired) {
        throw new UnauthorizedError(
          'Unauthorized: Token expired. Please login again or refresh the page.'
        )
      }
    }

    // Prevents to call ValidateSession or ValidateCartMutation without session (required) and get GraphQLError
    const doNotRun =
      (operation.__meta__.operationName === 'ValidateSession' ||
        operation.__meta__.operationName === 'ValidateCartMutation') &&
      !variables?.session

    if (doNotRun) {
      return
    }

    const { data, errors, extensions } = await execute(
      {
        operation,
        variables,
        query,
      },
      { headers: request.headers }
    )

    const hasErrors = Array.isArray(errors)

    if (hasErrors) {
      const error = errors.find(isFastStoreError)
      console.error(error)

      response.status(error?.extensions.status ?? 500).end()
      return
    }

    const cacheControl =
      !hasErrors && extensions.cacheControl
        ? stringifyCacheControl(extensions.cacheControl)
        : 'no-cache, no-store'

    if (
      request.method === 'GET' &&
      discoveryConfig?.experimental?.graphqlCacheControl?.maxAge
    ) {
      const maxAge = discoveryConfig.experimental.graphqlCacheControl.maxAge
      const staleWhileRevalidate =
        discoveryConfig?.experimental?.graphqlCacheControl
          ?.staleWhileRevalidate ?? ONE_MINUTE

      response.setHeader(
        'cache-control',
        `public, s-maxage=${maxAge}, stale-while-revalidate=${staleWhileRevalidate}`
      )
    } else {
      response.setHeader('cache-control', cacheControl)
    }

    const setCookieValues = Array.from(extensions.cookies.values())
    if (setCookieValues.length > 0 && !hasErrors) {
      response.setHeader(
        'set-cookie',
        setCookieValues.map(({ setCookie }) =>
          process.env.NODE_ENV !== 'production'
            ? replaceSetCookieDomain(request, setCookie)
            : setCookie
        )
      )
    }

    response.setHeader('content-type', 'application/json')
    response.send(JSON.stringify({ data, errors }))
  } catch (err) {
    console.error(err)

    if (err instanceof BadRequestError) {
      response.status(400).end()
      return
    }

    if (err instanceof UnauthorizedError) {
      response.status(401).end()
      return
    }

    response.status(500).end()
    return
  }
}

export default handler
