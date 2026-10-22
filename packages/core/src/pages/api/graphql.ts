import {
  BadRequestError,
  type CacheControl,
  UnauthorizedError,
  isFastStoreError,
  stringifyCacheControl,
} from '@faststore/api'
import { parse } from 'cookie'
import type { NextApiHandler, NextApiRequest } from 'next'

import discoveryConfig from 'discovery.config'
import { getJWTAutCookie } from 'src/utils/getCookie'
import { getRequestHostname } from 'src/utils/getRequestHostname'
import { shouldBypassRefreshToken } from 'src/utils/shouldBypassRefreshToken'
import {
  isHostAllowed,
  removeCookieDomain,
  singleForwardedHost,
} from 'src/utils/trustedForwardedHost'
import { shouldForceRefreshTokenForValidateSession } from 'src/utils/validateSessionRefreshToken'
import { execute } from '../../server'
import { logger } from '@faststore/diagnostics'

const OTELLogger = logger('@faststore/core')

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
 * On allowlisted hosts (previews, localhost) the upstream cookie domain does not
 * match the browser host, so the Domain attribute is dropped and the cookie
 * becomes host-only. The host is never written into the cookie, so a forged
 * x-forwarded-host cannot choose the cookie scope.
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

  // The preview ingress forwards a client-supplied x-forwarded-host as is, so
  // it only decides whether the Domain is dropped, never which domain is used.
  const forwardedHeader = request.headers['x-forwarded-host']
  const forwardedHost = getRequestHostname(singleForwardedHost(forwardedHeader))
  if (forwardedHeader && !forwardedHost) {
    // The value is client-controllable, so it is not logged.
    OTELLogger('warn', 'Ignoring multi-value or malformed x-forwarded-host')
  }
  const host =
    forwardedHost && isHostAllowed(forwardedHost, ALLOWED_HOST_SUFFIXES)
      ? forwardedHost
      : getRequestHostname(request.headers.host)
  if (!host) {
    return setCookie
  }
  const cookieDomain = domainMatch[1]

  if (
    !isHostAllowed(host, ALLOWED_HOST_SUFFIXES) ||
    !shouldReplaceCookieDomain({ cookieDomain, host })
  ) {
    return setCookie
  }

  return removeCookieDomain(setCookie)
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

/**
 * Responds to a GraphQL execution that returned errors: recovers the
 * upstream status from a FastStoreError when possible instead of collapsing
 * everything to 500, and logs every error for observability.
 */
const respondWithGraphqlErrors = (
  errors: readonly unknown[],
  response: Parameters<NextApiHandler>[1]
) => {
  // After error masking, entries are GraphQLError instances whose `name` is
  // "GraphQLError" — the original FastStoreError (carrying the upstream
  // status) is nested in `originalError`. Recover it so the BFF propagates
  // the real status instead of collapsing everything to 500.
  const fastStoreError = errors.map(recoverFastStoreError).find(Boolean)
  const reportedErrors = errors.map((graphqlError) => {
    const fsError = recoverFastStoreError(graphqlError)

    return {
      message: (graphqlError as { message?: string })?.message,
      status: fsError?.extensions.status,
      type: fsError?.extensions.type,
    }
  })

  console.error('Graphql execution returned with error: ', reportedErrors)
  OTELLogger(
    'error',
    'Graphql execution returned with error: %o',
    reportedErrors
  )

  const status = fastStoreError?.extensions.status ?? 500

  // Error responses are never cacheable: some upstream statuses (404, 410,
  // ...) are heuristically cacheable by intermediaries per RFC 9111 §4.2.2,
  // which would let a CDN cache an error for this operation.
  response.setHeader('cache-control', 'no-store')

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
    ...(process.env.NODE_ENV === 'production'
      ? {}
      : { message: fastStoreError.message }),
  }

  response.status(status)
  response.setHeader('content-type', 'application/json')
  response.send(JSON.stringify({ errors: [responseError] }))
}

/**
 * Responds to an error thrown out of the main handler try-block (a rejected
 * `parseRequest`/`execute`, or anything else unexpected).
 */
const respondToUnexpectedError = (
  err: unknown,
  response: Parameters<NextApiHandler>[1]
) => {
  // Same rationale as `respondWithGraphqlErrors`: a 400/401/500 here must
  // never be cached. This path can run after the success branch has already
  // set a cacheable cache-control (e.g. `setHeader('set-cookie', ...)`
  // rejecting a malformed upstream cookie, or `JSON.stringify` throwing
  // after cache-control was set but before `send` completed). Guarded by
  // `headersSent`: if the throw came from `send()` itself after headers were
  // already flushed, `setHeader` would throw ERR_HTTP_HEADERS_SENT and this
  // would fail to produce a handled response.
  if (!response.headersSent) {
    response.setHeader('cache-control', 'no-store')
  }

  console.error(
    'Something unexpected occurred querying Graphql endpoint: \n',
    err
  )
  OTELLogger(
    'error',
    'Something unexpected occurred querying Graphql endpoint: %o',
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
}

/**
 * With `experimental.refreshToken` on, rejects a ValidateSession with 401 when
 * the token needs a refresh, so the client runs the refresh-token flow first.
 *
 * Skipped on localhost and WebOps previews: neither proxies VTEX ID, so the
 * refresh would fail and log out a manually injected auth cookie.
 */
const assertValidateSessionTokenIsFresh = ({
  request,
  operationName,
  sessionRefreshAfter,
}: {
  request: NextApiRequest
  operationName: string | undefined
  sessionRefreshAfter: string | null | undefined
}) => {
  if (
    operationName !== 'ValidateSession' ||
    !discoveryConfig.experimental?.refreshToken ||
    shouldBypassRefreshToken(getRequestHostname(request.headers.host))
  ) {
    return
  }

  const jwt = getJWTAutCookie({
    headers: request.headers,
    account: discoveryConfig.api.storeId,
  })

  if (shouldForceRefreshTokenForValidateSession({ jwt, sessionRefreshAfter })) {
    throw new UnauthorizedError(
      'Unauthorized: Token expired. Please login again or refresh the page.'
    )
  }
}

/**
 * Cache-Control for a successful response: the directives collected while
 * executing the operation when there are any, otherwise a default
 * `s-maxage`/`stale-while-revalidate` for GET queries and `no-store` for
 * everything else.
 */
const getSuccessCacheControl = ({
  request,
  operationName,
  cacheControl,
  hasAuthCookie,
}: {
  request: NextApiRequest
  operationName: string | undefined
  cacheControl: CacheControl | undefined
  hasAuthCookie: boolean
}) => {
  if (cacheControl) {
    return stringifyCacheControl(cacheControl, hasAuthCookie)
  }

  if (
    request.method !== 'GET' ||
    !operationName?.toLowerCase()?.endsWith('query')
  ) {
    return 'no-cache, no-store'
  }

  const graphqlCacheControl = discoveryConfig?.experimental?.graphqlCacheControl

  const maxAge =
    graphqlCacheControl?.maxAge && graphqlCacheControl.maxAge > 0
      ? graphqlCacheControl.maxAge
      : DEFAULT_MAX_AGE // 5 minutes

  const staleWhileRevalidate =
    graphqlCacheControl?.staleWhileRevalidate &&
    graphqlCacheControl.staleWhileRevalidate > 0
      ? graphqlCacheControl.staleWhileRevalidate
      : DEFAULT_STALE_WHILE_REVALIDATE // 1 hour

  const scope = hasAuthCookie ? 'private' : 'public'
  return `${scope}, s-maxage=${maxAge}, stale-while-revalidate=${staleWhileRevalidate}`
}

const handler: NextApiHandler = async (request, response) => {
  if (request.method !== 'POST' && request.method !== 'GET') {
    response.status(405).end()
    OTELLogger(
      'info',
      'Invalid request method: %s %s',
      request.method,
      request.url
    )

    return
  }

  try {
    // value is used to cache bust the request if there is a VtexIdclientAutCookie
    const { operation, variables, query, v: value } = parseRequest(request)

    // Variables and the query body are deliberately not logged: they carry
    // session and customer data.
    OTELLogger(
      'debug',
      'operation: %s hash: %s',
      operation?.__meta__?.operationName,
      operation?.__meta__?.operationHash
    )

    assertValidateSessionTokenIsFresh({
      request,
      operationName: operation.__meta__.operationName,
      sessionRefreshAfter: variables?.session?.refreshAfter,
    })

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
      respondWithGraphqlErrors(errors, response)
      return
    }

    const hasAuthCookie = hasVtexIdclientAutCookie(request)

    response.setHeader(
      'cache-control',
      getSuccessCacheControl({
        request,
        operationName: operation.__meta__.operationName,
        cacheControl: extensions.cacheControl,
        hasAuthCookie,
      })
    )

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
    respondToUnexpectedError(err, response)
  }
}

export default handler
