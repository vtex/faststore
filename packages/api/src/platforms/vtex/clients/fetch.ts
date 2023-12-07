import fetch from 'isomorphic-unfetch'
import packageJson from '../../../../package.json'

const USER_AGENT = `${packageJson.name}@${packageJson.version}`

export const fetchAPI = async (
  info: RequestInfo,
  init?: RequestInit,
  getHeaders?: (headers: Headers) => void
) => {
  const response = await fetch(info, {
    ...init,
    headers: {
      ...init?.headers,
      'User-Agent': USER_AGENT,
    },
  })

  if (response.ok) {
    if (getHeaders) {
      getHeaders(response.headers)
    }

    return response.status !== 204 ? response.json() : undefined
  }

  console.error(info, init, response)
  const text = await response.text()

  throw new Error(text)
}
