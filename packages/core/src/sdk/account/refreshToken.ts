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

export const refreshTokenRequest = async (): Promise<
  RefreshTokenResponse | undefined
> => {
  const REFRESH_TOKEN_URL = `${getStoreURL()}/api/vtexid/refreshtoken/webstore`
  const headers: HeadersInit = {
    'content-type': 'application/json',
    Host: `${sanitizeHost(getStoreURL())}`,
  }

  return await fetchWithRetry(REFRESH_TOKEN_URL, {
    credentials: 'include',
    headers,
    body: JSON.stringify({}),
    method: 'POST',
  })
}

export const isRefreshTokenSuccessful = (
  result: RefreshTokenResponse | undefined
): boolean => {
  return result?.status?.toLowerCase?.() === 'success'
}
