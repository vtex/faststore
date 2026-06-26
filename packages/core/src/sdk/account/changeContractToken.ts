import fetch from 'isomorphic-unfetch'

import storeConfig from '../../../discovery.config'

export class ContractSwitchError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ContractSwitchError'
  }
}

export const isContractSwitchEnabled = true

type VtexAuthCookie = {
  Name: string
  Value: string
}

export type SwitchPropertiesResponse = {
  authStatus?: string
  expiresIn?: number
  authCookie?: VtexAuthCookie | null
  accountAuthCookie?: VtexAuthCookie | null
}

const DEFAULT_AUTH_COOKIE_MAX_AGE = 86_400

export function applyVtexAuthCookieFromSwitchResponse(
  response: SwitchPropertiesResponse
): void {
  if (globalThis.window === undefined) {
    return
  }

  const maxAge = response.expiresIn ?? DEFAULT_AUTH_COOKIE_MAX_AGE
  const secure =
    globalThis.window.location.protocol === 'https:' ? '; secure' : ''

  const cookies = [response.authCookie, response.accountAuthCookie].filter(
    (cookie): cookie is VtexAuthCookie =>
      Boolean(cookie?.Name?.trim() && cookie?.Value)
  )

  for (const cookie of cookies) {
    document.cookie = `${cookie.Name}=${cookie.Value}; path=/; max-age=${maxAge}; samesite=lax${secure}`
  }
}

/**
 * Switches the buyer's active contract via VTEX Identity storefront credential API.
 *
 * POST /api/authenticator/storefront/credential/switch-properties?an={account}
 * Body: { properties: { customerId: contractId } }
 *
 * Applies the returned `authCookie` (and optional `accountAuthCookie`) so the
 * storefront JWT reflects the new commercial context. Throws `ContractSwitchError`
 * on hard failures so `switchContract` can keep the previous contract active.
 */
export async function changeContractToken(
  contractId: string
): Promise<boolean> {
  if (!contractId) {
    throw new ContractSwitchError('Missing contractId for contract switch')
  }

  const an = encodeURIComponent(storeConfig.api.storeId)

  const response = await fetch(
    `/api/authenticator/storefront/credential/switch-properties?an=${an}`,
    {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        properties: {
          customerId: contractId,
        },
      }),
    }
  )

  if (!response.ok) {
    throw new ContractSwitchError(
      `Failed to switch contract (${response.status})`
    )
  }

  const payload = (await response.json()) as SwitchPropertiesResponse

  if (payload.authStatus?.toLowerCase() !== 'success') {
    throw new ContractSwitchError('Contract switch was not successful')
  }

  if (!payload.authCookie?.Name || !payload.authCookie?.Value) {
    throw new ContractSwitchError(
      'Contract switch succeeded but no auth cookie was returned'
    )
  }

  applyVtexAuthCookieFromSwitchResponse(payload)

  return true
}
