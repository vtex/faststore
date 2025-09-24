// import fetch from 'isomorphic-unfetch'
import packageJson from '../../../../package.json'
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

  console.error(info, init, response)
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
