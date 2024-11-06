import fetch from 'isomorphic-unfetch'
import packageJson from '../../../../package.json'

const USER_AGENT = `${packageJson.name}@${packageJson.version}`

const IS_PRODUCTION = process.env.NODE_ENV === 'production'

export const fetchAPI = async (info: RequestInfo, init?: RequestInit) => {
  let customInfo = info.toString()

  if (IS_PRODUCTION && customInfo.includes('vtexcommercestable')) {
    const url = new URL(customInfo)
    url.protocol = 'http'
    url.hostname = `${packageJson.name}.vtexinternal.com`
    url.searchParams.append('an', url.hostname.split('.')[0])
    customInfo = url.toString()
  }

  const response = await fetch(customInfo, {
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
