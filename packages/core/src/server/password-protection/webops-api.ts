import discoveryConfig from '../../../discovery.config'

const DEFAULT_WEBOPS_ORIGIN = 'https://faststore.vtex.com'

function getWebopsOrigin(): string {
  const hostFromEnv = process.env.WEBOPS_API_URL?.trim() ?? ''
  const hostWithoutTrailingSlash = hostFromEnv.replace(/\/+$/, '')
  const origin =
    hostWithoutTrailingSlash.length > 0
      ? hostWithoutTrailingSlash
      : DEFAULT_WEBOPS_ORIGIN

  return /^https?:\/\//i.test(origin) ? origin : `https://${origin}`
}

export function publicKeyUrl(): URL {
  return new URL('/api/v1/password-protection/public-key', getWebopsOrigin())
}

export function protectionStatusUrl(): URL {
  const url = new URL('/api/v1/password-protection/status', getWebopsOrigin())
  url.searchParams.set('storeId', discoveryConfig.api.storeId)
  return url
}

export function sessionUrl(): URL {
  return new URL('/api/v1/password-protection/session', getWebopsOrigin())
}

export function renewUrl(): URL {
  return new URL('/api/v1/password-protection/renew', getWebopsOrigin())
}

/** Timeouts for WebOps password-protection calls (middleware / API routes). */
export const passwordProtectionTimeouts = {
  publicKeyMs: 5_000,
  defaultMs: 10_000,
} as const
