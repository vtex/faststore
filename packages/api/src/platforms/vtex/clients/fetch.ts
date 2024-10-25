import fetch from 'isomorphic-unfetch'
import packageJson from '../../../../package.json'

const USER_AGENT = `${packageJson.name}@${packageJson.version}`

interface FetchAPIOptions {
  storeCookies?: (headers: Headers) => void
}

const buildHeaders = (initHeaders?: HeadersInit, segment?: string | null): HeadersInit => {
  const headers = new Headers(initHeaders);

  headers.set('User-Agent', USER_AGENT);

  if (segment) {
    headers.set('Cookie', `vtex_segment=${segment}`);
  }

  return headers;
};

export const fetchAPI = async (
  info: RequestInfo,
  init?: RequestInit,
  options?: FetchAPIOptions,
  segment?: string | null
) => {
  const response = await fetch(info, {
    ...init,
    headers: buildHeaders(init?.headers, segment),
  });

  console.log('fetchAPI', response)

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
