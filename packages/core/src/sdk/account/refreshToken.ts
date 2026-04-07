import discoveryConfig from 'discovery.config'
import fetch from 'isomorphic-unfetch'

export interface RefreshTokenResponse {
  status?: string
  refreshAfter?: string
}

const PROXY_PATH = '/api/fs/refresh-token'

let inFlightRefresh: Promise<RefreshTokenResponse | undefined> | null = null

async function fetchWithRetry(
  url: RequestInfo | URL,
  init: RequestInit,
  maxRetries = 3
): Promise<RefreshTokenResponse | undefined> {
  let lastStatus = 0
  let lastBody = ''

  for (let i = 0; i < maxRetries; i++) {
    try {
      const res = await fetch(url, init)
      lastStatus = res.status
      lastBody = await res.text()

      if (res.status !== 200) {
        console.error(
          '[refreshTokenRequest] non-200 response',
          lastStatus,
          lastBody.slice(0, 500)
        )
        continue
      }

      try {
        return JSON.parse(lastBody) as RefreshTokenResponse
      } catch {
        console.error(
          '[refreshTokenRequest] invalid JSON',
          lastBody.slice(0, 500)
        )
      }
    } catch (err) {
      console.error('[refreshTokenRequest] fetch error', err)
    }
  }

  console.error(
    '[refreshTokenRequest] exhausted retries',
    lastStatus,
    lastBody.slice(0, 500)
  )
  return undefined
}

export const refreshTokenRequest = async (): Promise<
  RefreshTokenResponse | undefined
> => {
  if (!discoveryConfig.experimental?.refreshToken) {
    return undefined
  }

  if (inFlightRefresh) {
    return inFlightRefresh
  }

  inFlightRefresh = fetchWithRetry(
    PROXY_PATH,
    {
      credentials: 'include',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({}),
      method: 'POST',
    },
    3
  ).finally(() => {
    inFlightRefresh = null
  })

  return inFlightRefresh
}

export const isRefreshTokenSuccessful = (
  result: RefreshTokenResponse | undefined
): boolean => {
  return result?.status?.toLowerCase?.() === 'success'
}
