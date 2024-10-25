import fetch from 'isomorphic-unfetch'
import packageJson from '../../../../package.json'

const USER_AGENT = `${packageJson.name}@${packageJson.version}`

interface FetchAPIOptions {
  storeCookies?: (headers: Headers) => void
  segmentCookie?: string | null
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
      ...(options.segment ? { Cookie: `vtex_segment=${options.segment}` } : {}),
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

  throw new Error(text)
}

