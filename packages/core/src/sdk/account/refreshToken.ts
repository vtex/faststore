import fetch from 'isomorphic-unfetch'
import { getStoreURL } from 'src/sdk/localization/useLocalizationConfig'
import { sanitizeHost } from 'src/utils/utilities'

export interface RefreshTokenResponse {
  status?: string
  refreshAfter?: string
}

async function fetchWithRetry(
  url: RequestInfo | URL,
  init?: RequestInit,
  maxRetries = 3
): Promise<RefreshTokenResponse | undefined> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const res = await fetch(url, init)
      if (res.status !== 200) continue

      const data = await res.json()
      return data
    } catch {}
  }

  return undefined
}

function getRefreshTokenUrl(): string {
  if (typeof window !== 'undefined') {
    return '/api/vtexid/refreshtoken/webstore'
  }

  return `${new URL(getStoreURL()).origin}/api/vtexid/refreshtoken/webstore`
}

function getRefreshTokenHeaders(): HeadersInit {
  const headers: HeadersInit = {
    'content-type': 'application/json',
  }

  if (typeof window === 'undefined') {
    headers.Host = `${sanitizeHost(new URL(getStoreURL()).origin)}`
  }

  return headers
}

export const refreshTokenRequest = async (): Promise<
  RefreshTokenResponse | undefined
> => {
  return fetchWithRetry(getRefreshTokenUrl(), {
    credentials: 'include',
    headers: getRefreshTokenHeaders(),
    body: JSON.stringify({}),
    method: 'POST',
  })
}

export const isRefreshTokenSuccessful = (
  result: RefreshTokenResponse | undefined
): boolean => {
  return result?.status?.toLowerCase?.() === 'success'
}
