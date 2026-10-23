import fetch from 'isomorphic-unfetch'
import packageJson from '../../../../package.json'

const USER_AGENT = `${packageJson.name}@${packageJson.version}`

// Headers that carry credentials (store API keys and shopper cookies). They
// are replaced before the failed request is logged.
const SENSITIVE_HEADER =
  /^(x-vtex-api-appkey|x-vtex-api-apptoken|cookie|set-cookie|vtexidclientautcookie.*)$/i

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

  if (Array.isArray(headers)) {
    headers.forEach(([name, value]) => add(name, value))
  } else if (typeof (headers as Headers).forEach === 'function') {
    // Matches both the global `Headers` and the polyfill returned by
    // `isomorphic-unfetch` on Node, which isn't an instance of the global one.
    const headerList = headers as Headers
    headerList.forEach((value, name) => add(name, value))
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

  // Log a summary instead of the raw Response, whose headers may include
  // `Set-Cookie` with shopper credentials. The request body is omitted because
  // it can carry personal data (e.g. the newsletter email and name).
  console.error(
    info,
    init && {
      ...init,
      headers: redactHeaders(init.headers),
      body: init.body ? REDACTED : undefined,
    },
    {
      status: response.status,
      statusText: response.statusText,
      headers: redactHeaders(response.headers),
    }
  )
  const text = await response.text()

  throw new Error(text)
}
