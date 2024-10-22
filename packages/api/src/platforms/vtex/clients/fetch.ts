import fetch from 'isomorphic-unfetch'
import packageJson from '../../../../package.json'
import { Options as ApiOptions } from '..'

const USER_AGENT = `${packageJson.name}@${packageJson.version}`
const PRODUCTION_MODE = process.env.NODE_ENV === 'production'
const DEFAULT_PUBLIC_API_HOST = 'vtexcommercestable'

const VTEX_API_TO_INTERNAL_API_NAME: { [key: string]: string } = {
  catalog: 'catalogapi',
  checkout: 'checkoutapi',
  io: 'ioapi',
  md: 'mdapi',
  sessions: 'sessionsapi',
}

type RequestOptions = {
  account: string
  environment: ApiOptions['environment']
  storeCookies?: (headers: Headers) => void
  vtexApi: 'catalog' | 'checkout' | 'io' | 'md' | 'sessions'
}

export type FetchAPI = {
  path: string
  init?: RequestInit
  options: RequestOptions
}

const getBasePrefix = async ({
  vtexApi,
  account,
  environment,
}: {
  account: string
  environment: string
  vtexApi: RequestOptions['vtexApi']
}) => {
  if (PRODUCTION_MODE && environment === 'vtexinternal') {
    return `http://${VTEX_API_TO_INTERNAL_API_NAME[vtexApi]}.vtexinternal.com`
  }

  // We should not use `environment` here when its value is `vtexinternal`
  return `https://${account}.${environment === 'vtexinternal' ? DEFAULT_PUBLIC_API_HOST : environment}.com.br`
}

export const fetchAPI = async ({ path, init, options }: FetchAPI) => {
  const requestInfoPrefix = await getBasePrefix({
    account: options.account,
    environment: options.environment,
    vtexApi: options.vtexApi,
  })

  let requestInfo = requestInfoPrefix + path
  let requestInit: RequestInit = {
    ...init,
    headers: {
      ...(init?.headers ?? {}),
      'User-Agent': USER_AGENT,
    },
  }

  // Check the environment to specify the account
  if (PRODUCTION_MODE && options.environment === 'vtexinternal') {
    const hasParams = requestInfo.includes('?')

    requestInfo += hasParams
      ? `&an=${options.account}`
      : `?an=${options.account}`
    requestInit = {
      ...requestInit,
      headers: {
        ...requestInit.headers,
        // We should avoid the *.myvtex.com host since it is only meant to be used by Admin
        Host: `${options.account}.vtexcommercestable.com.br`,
      },
    }
  }

  const response = await fetch(requestInfo, requestInit)

  if (response.ok) {
    if (options?.storeCookies) {
      options.storeCookies(response.headers)
    }

    return response.status !== 204 ? response.json() : undefined
  }

  console.error(requestInfo, requestInit, response)
  const text = await response.text()

  throw new Error(text)
}
