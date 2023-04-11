import fetch from 'isomorphic-unfetch'
import packageJson from '../../../../package.json'

const USER_AGENT = `${packageJson.name}@${packageJson.version}`

export const fetchAPI = async (info: RequestInfo, init?: RequestInit) => {
  const response = await fetch(info, {
    ...init,
    headers: {
      ...init?.headers,
      'User-Agent': USER_AGENT,
    },
  })

  if (response.ok) {
    return response.status !== 204 ? response.json() : undefined
  }

  console.error(info, init, response)
  const text = await response.text()

  throw new Error(text)
}
