import fetch, { RequestInfo, RequestInit, Headers } from 'node-fetch'
import packageJson from '../../../../package.json'

const USER_AGENT = `${packageJson.name}@${packageJson.version}`

interface FetchAPIOptions {
  storeCookies?: (headers: Headers) => void
}

export const fetchAPI = async <T>(
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

    return (response.status !== 204 ? response.json() : undefined) as Promise<T>
  }

  console.error(info, init, response)
  const text = await response.text()

  throw new Error(text)
}
