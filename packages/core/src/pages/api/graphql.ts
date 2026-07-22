import {
  BadRequestError,
  UnauthorizedError,
  isFastStoreError,
  stringifyCacheControl,
} from '@faststore/api'
import { parse } from 'cookie'
import type { NextApiHandler, NextApiRequest } from 'next'

import discoveryConfig from 'discovery.config'
import { getJWTAutCookie } from 'src/utils/getCookie'
import { getRequestHostname } from 'src/utils/getRequestHostname'
import { isLocalHost } from 'src/utils/isLocalHost'
import { shouldForceRefreshTokenForValidateSession } from 'src/utils/validateSessionRefreshToken'
import { execute } from '../../server'
import { getOTELLogger, logger } from '@faststore/diagnostics'

const OTELLogger = logger(getOTELLogger('@faststore/core'))

const DEFAULT_MAX_AGE = 5 * 60 // 5 minutes
const DEFAULT_STALE_WHILE_REVALIDATE = 60 * 60 // 1 hour
const ALLOWED_HOST_SUFFIXES = ['localhost', '.vtex.app', '.localhost']

/**
 * Recovers a FastStoreError from an execution error, whether it is the error
 * itself or wrapped as the `originalError` of a masked GraphQLError.
 */
const recoverFastStoreError = (graphqlError: unknown) => {
  if (isFastStoreError(graphqlError)) {
    return graphqlError
  }

  const originalError = (graphqlError as { originalError?: unknown })
    ?.originalError

  return isFastStoreError(originalError) ? originalError : undefined
}

// Example: "Set-Cookie: key=value; Domain=example.com; Path=/"
const MATCH_DOMAIN_REGEXP = /(?:^|;\s*)(?:domain=)([^;]+)/i

/**
 * Checks whether the cookie domain should be replaced by host.
 */
const shouldReplaceCookieDomain = ({
  cookieDomain,
  host,
}: {
  cookieDomain: string
  host: string
}) => {
  const normalizedDomain = cookieDomain.replace(/^\./, '').toLowerCase()
  const normalizedHost = host.toLowerCase()

  return normalizedDomain !== normalizedHost
}

/**
 * Determines if host is eligible for domain normalization.
 */
const isAllowedHost = ({
  host,
  allowList,
}: {
  host: string
  allowList: string[]
}) => {
  const normalizedHost = host.toLowerCase()

  return allowList.some((suffix) => normalizedHost.endsWith(suffix))
}

/**
 * Ensure the cookie domain matches the current host so the browser can store it.
 */
const normalizeSetCookieDomain = ({
  request,
  setCookie,
}: {
  request: NextApiRequest
  setCookie: string
}) => {
  const domainMatch = setCookie.match(MATCH_DOMAIN_REGEXP)
  if (!domainMatch) {
    return setCookie
  }

  const host = getRequestHostname(request.headers.host)
  if (!host) {
    return setCookie
  }
  const cookieDomain = domainMatch[1]

  if (
    !isAllowedHost({ host, allowList: ALLOWED_HOST_SUFFIXES }) ||
    !shouldReplaceCookieDomain({ cookieDomain, host })
  ) {
    return setCookie
  }

  return setCookie.replace(MATCH_DOMAIN_REGEXP, `; domain=${host}`)
}

const parseRequest = (request: NextApiRequest) => {
  try {
    const { operationName, operationHash, variables, query, v } =
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
            v: request.query.v,
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
      v,
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

/**
 * Checks if there is any cookie that starts with 'VtexIdclientAutCookie'
 * in the request headers
 */
const hasVtexIdclientAutCookie = (request: NextApiRequest): boolean => {
  const cookies = parse(request.headers.cookie ?? '')
  return Object.keys(cookies).some((cookieName) =>
    cookieName.startsWith('VtexIdclientAutCookie')
  )
}

const handler: NextApiHandler = async (request, response) => {
  if (request.method !== 'POST' && request.method !== 'GET') {
    response.status(405).end()
    OTELLogger(
      'info',
      `Invalid request method.\nRequest: ${JSON.stringify(request)}`
    )

    return
  }

  try {
    // value is used to cache bust the request if there is a VtexIdclientAutCookie
    const { operation, variables, query, v: value } = parseRequest(request)

    OTELLogger(
      'debug',
      `operation: ${operation?.__meta__?.operationName} hash: ${operation?.__meta__?.operationHash}
variables: ${JSON.stringify(variables, null, 2)}
query: ${query}
value: ${value}`
    )

    const isLocal = isLocalHost(getRequestHostname(request.headers.host))

    if (
      !isLocal &&
      operation.__meta__.operationName === 'ValidateSession' &&
      discoveryConfig.experimental?.refreshToken
    ) {
      const jwt = getJWTAutCookie({
        headers: request.headers,
        account: discoveryConfig.api.storeId,
      })

      const shouldRefreshToken = shouldForceRefreshTokenForValidateSession({
        jwt,
        sessionRefreshAfter: variables?.session?.refreshAfter,
      })

      if (shouldRefreshToken) {
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
        variables: { ...variables, ...(value ? { v: value } : {}) },
        query,
      },
      { headers: request.headers }
    )

    const hasErrors = Array.isArray(errors) && errors.length > 0

    if (hasErrors) {
      // After error masking, entries are GraphQLError instances whose
      // `name` is "GraphQLError" — the original FastStoreError (carrying the
      // upstream status) is nested in `originalError`. Recover it so the BFF
      // propagates the real status instead of collapsing everything to 500.
      const fastStoreError = errors.map(recoverFastStoreError).find(Boolean)
      console.error(
        'Graphql execution returned with error: ',
        errors.map((graphqlError) => {
          const fsError = recoverFastStoreError(graphqlError)
          OTELLogger(
            'error',
            `Graphql execution returned with error:\ngraphql-Error: ${graphqlError}\nfaststore-Error: ${fsError}`
          )

          return {
            message: (graphqlError as { message?: string })?.message,
            status: fsError?.extensions.status,
            type: fsError?.extensions.type,
          }
        })
      )

      const status = fastStoreError?.extensions.status ?? 500

      // No recoverable FastStoreError: keep the masked, body-less 500.
      if (!fastStoreError) {
        response.status(status).end()
        return
      }

      // Only FastStoreError-derived details are exposed. `type`/`status` are a
      // closed enum (safe everywhere); the free-text `message` may echo raw
      // upstream text, so it is restricted to non-production responses. The
      // full message is still available server-side via the log above.
      const responseError = {
        extensions: {
          type: fastStoreError.extensions.type,
          status: fastStoreError.extensions.status,
        },
        ...(process.env.NODE_ENV !== 'production'
          ? { message: fastStoreError.message }
          : {}),
      }

      response.status(status)
      response.setHeader('content-type', 'application/json')
      response.send(JSON.stringify({ errors: [responseError] }))
      return
    }

    const hasAuthCookie = hasVtexIdclientAutCookie(request)

    if (extensions.cacheControl) {
      const cacheControl = stringifyCacheControl(
        extensions.cacheControl,
        hasAuthCookie
      )
      response.setHeader('cache-control', cacheControl)
    } else if (
      request.method === 'GET' &&
      operation.__meta__.operationName?.toLowerCase()?.endsWith('query')
    ) {
      const maxAge =
        discoveryConfig?.experimental?.graphqlCacheControl?.maxAge &&
        discoveryConfig?.experimental?.graphqlCacheControl?.maxAge > 0
          ? discoveryConfig.experimental.graphqlCacheControl.maxAge
          : DEFAULT_MAX_AGE // 5 minutes

      const staleWhileRevalidate =
        discoveryConfig?.experimental?.graphqlCacheControl
          ?.staleWhileRevalidate &&
        discoveryConfig?.experimental?.graphqlCacheControl
          ?.staleWhileRevalidate > 0
          ? discoveryConfig.experimental.graphqlCacheControl
              .staleWhileRevalidate
          : DEFAULT_STALE_WHILE_REVALIDATE // 1 hour

      const scope = hasAuthCookie ? 'private' : 'public'
      response.setHeader(
        'cache-control',
        `${scope}, s-maxage=${maxAge}, stale-while-revalidate=${staleWhileRevalidate}`
      )
    } else response.setHeader('cache-control', 'no-cache, no-store')

    const setCookieValues = Array.from(extensions.cookies.values())
    if (setCookieValues.length > 0 && !hasErrors) {
      response.setHeader(
        'set-cookie',
        setCookieValues.map(({ setCookie }) =>
          normalizeSetCookieDomain({ request, setCookie })
        )
      )
    }

    response.setHeader('content-type', 'application/json')
    response.send(JSON.stringify({ data, errors }))
  } catch (err) {
    OTELLogger('error', err)
    console.error(
      'Something unexpected occurred querying Graphql endpoint: \n',
      err
    )

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
