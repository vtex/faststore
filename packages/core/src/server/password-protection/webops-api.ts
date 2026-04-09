const DEFAULT_WEBOPS_ORIGIN = 'https://faststore.vtex.com'

export function getWebOpsApiOrigin(): string {
  const raw = process.env.WEBOPS_API_URL?.trim()

  if (!raw) {
    return DEFAULT_WEBOPS_ORIGIN
  }

  return raw.replace(/\/+$/, '')
}

/** Timeouts for WebOps password-protection calls (middleware / API routes). */
export const webopsPasswordProtectionTimeouts = {
  publicKeyMs: 5_000,
  defaultMs: 10_000,
} as const

export function webopsPasswordProtectionPublicKeyUrl(): string {
  return `${getWebOpsApiOrigin()}/api/v1/password-protection/public-key`
}

export function webopsPasswordProtectionStatusUrl(storeId: string): string {
  const q = new URLSearchParams({ storeId })
  return `${getWebOpsApiOrigin()}/api/v1/password-protection/status?${q}`
}

export function webopsPasswordProtectionSessionUrl(): string {
  return `${getWebOpsApiOrigin()}/api/v1/password-protection/session`
}

export function webopsPasswordProtectionRenewUrl(): string {
  return `${getWebOpsApiOrigin()}/api/v1/password-protection/renew`
}
