import fetch from 'isomorphic-unfetch'
import packageJson from '../../../../package.json'

const USER_AGENT = `${packageJson.name}@${packageJson.version}`

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

  console.error(
    info,
    init && { ...init, headers: redactHeaders(init.headers) },
    response
  )
  const text = await response.text()

  throw new Error(text)
}
