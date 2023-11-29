import fetch from 'isomorphic-unfetch'
import packageJson from '../../../../package.json'
import type { Context } from '../index'

const USER_AGENT = `${packageJson.name}@${packageJson.version}`

export const fetchAPI = async (
  info: RequestInfo,
  ctx: Context,
  init?: RequestInit,
) => {
  const response = await fetch(info, {
    ...init,
    headers: {
      ...init?.headers,
      'User-Agent': USER_AGENT,
    },
  })

  if (response.ok) {
    ctx.storage.cookies = response.headers?.get('set-cookie') ?? ''

    return response.status !== 204 ? response.json() : undefined
  }

  console.error(info, init, response)
  const text = await response.text()

  throw new Error(text)
}
