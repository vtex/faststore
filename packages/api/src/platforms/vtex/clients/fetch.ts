import fetch from 'isomorphic-unfetch'
import packageJson from '../../../../package.json'
import { NotAuthorizedError } from '../../errors'

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

    const json = response.status !== 204 ? await response.json() : undefined

    if (typeof json === 'string' && json.toLowerCase() === 'invalid user') {
      console.error(info, init, response)
      throw new NotAuthorizedError(json)
    }

    return json
  }

  console.error(info, init, response)
  const text = await response.text()

  throw new Error(text)
}
