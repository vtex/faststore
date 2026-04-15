import discoveryConfig from '../../../discovery.config'

const DEFAULT_WEBOPS_ORIGIN = 'https://faststore.vtex.com'

let origin =
  process.env.WEBOPS_API_URL?.trim().replaceAll(/\/+$/g, '') ??
  DEFAULT_WEBOPS_ORIGIN

origin = origin.startsWith('http') ? origin : `https://${origin}`

export const publicKeyUrl = new URL(
  '/api/v1/password-protection/public-key',
  origin
)

export const protectionStatusUrl = new URL(
  `/api/v1/password-protection/status?storeId=${discoveryConfig.api.storeId}`,
  origin
)

export const sessionUrl = new URL('/api/v1/password-protection/session', origin)

export const renewUrl = new URL('/api/v1/password-protection/renew', origin)

/** Timeouts for WebOps password-protection calls (middleware / API routes). */
export const passwordProtectionTimeouts = {
  publicKeyMs: 5_000,
  defaultMs: 10_000,
} as const
