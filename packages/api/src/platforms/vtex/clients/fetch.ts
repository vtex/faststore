import fetch from 'isomorphic-unfetch'
import packageJson from '../../../../package.json' with { type: 'json' }
import {
  BadRequestError,
  FastStoreError,
  ForbiddenError,
  NotFoundError,
  UnauthorizedError,
} from '../../errors'

const USER_AGENT = `${packageJson.name}@${packageJson.version}`

interface FetchAPIOptions {
  storeCookies?: (headers: Headers) => void
}

// Headers that may carry credentials: store API keys (`X-VTEX-API-AppKey`,
// `X-VTEX-API-AppToken`), shopper cookies (`Cookie`, `Set-Cookie`,
// `VtexIdclientAutCookie_*`), `Authorization`, and generic token, secret or
// API key headers. They are replaced before a failed request and its response
// are logged. Matched by substring so new credential headers are covered too.
const SENSITIVE_HEADER = /authorization|cookie|token|secret|api-?key|appkey/i

const REDACTED = '[redacted]'

export const redactHeaders = (
  headers?: HeadersInit
): Record<string, string> | undefined => {
  if (!headers) {
    return undefined
  }

  const redacted: Record<string, string> = {}
  const add = (name: string, value: string) => {
    redacted[name] = SENSITIVE_HEADER.test(name) ? REDACTED : value
  }

  if (Array.isArray(headers)) {
    headers.forEach(([name, value]) => add(name, value))
  } else if (typeof (headers as Headers).forEach === 'function') {
    // Matches both the global `Headers` and the polyfill returned by
    // `isomorphic-unfetch` on Node, which isn't an instance of the global one.
    const headerList = headers as Headers
    headerList.forEach((value, name) => add(name, value))
  } else {
    Object.entries(headers).forEach(([name, value]) => add(name, value))
  }

  return redacted
}

export const fetchAPI = async (
  info: RequestInfo,
  init?: RequestInit,
  options?: FetchAPIOptions
) => {
  const response = await fetch(info, {
    ...init,
    headers: {
      ...(init?.headers ?? {}),
      'User-Agent': USER_AGENT,
    },
  })

  if (response.ok) {
    if (options?.storeCookies) {
      options.storeCookies(response.headers)
    }

    return response.status !== 204 ? response.json() : undefined
  }

  // Log a summary instead of the raw Response, whose headers may include
  // `Set-Cookie` with shopper credentials. The request body is omitted because
  // it can carry personal data (e.g. the newsletter email and name).
  console.error(
    info,
    init && {
      ...init,
      headers: redactHeaders(init.headers),
      body: init.body ? REDACTED : undefined,
    },
    {
      status: response.status,
      statusText: response.statusText,
      headers: redactHeaders(response.headers),
    }
  )
  const text = await response.text()

  // Check if response has a valid status property
  if (typeof response?.status === 'number') {
    switch (response.status) {
      case 400:
        throw new BadRequestError(text)
      case 401:
        throw new UnauthorizedError(text)
      case 403:
        throw new ForbiddenError(text)
      case 404:
        throw new NotFoundError(text)
      default:
        throw new FastStoreError(
          { status: response.status, type: 'UnknownError' },
          text
        )
    }
  }

  // Fallback to generic Error if status doesn't exist or is invalid - maybe network error
  throw new Error(text)
}
