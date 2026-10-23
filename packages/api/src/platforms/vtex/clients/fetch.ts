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

// Headers that carry credentials (store API keys and shopper cookies). They
// are replaced before the failed request is logged.
const SENSITIVE_HEADER =
  /^(x-vtex-api-appkey|x-vtex-api-apptoken|cookie|vtexidclientautcookie.*)$/i

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

  if (typeof Headers !== 'undefined' && headers instanceof Headers) {
    headers.forEach((value, name) => add(name, value))
  } else if (Array.isArray(headers)) {
    headers.forEach(([name, value]) => add(name, value))
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

  console.error(
    info,
    init && { ...init, headers: redactHeaders(init.headers) },
    response
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
