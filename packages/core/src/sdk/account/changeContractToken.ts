import fetch from 'isomorphic-unfetch'

import storeConfig from '../../../discovery.config'

export class ContractSwitchError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ContractSwitchError'
  }
}

export const isContractSwitchEnabled = true

/**
 * Switches the buyer's active contract via VTEX Identity storefront credential API.
 *
 * POST /api/authenticator/storefront/credential/switch-properties?an={account}
 * Body: { properties: { customerId: contractId } }
 *
 * Returns `true` when the server confirms the switch. Throws `ContractSwitchError`
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

  return true
}
