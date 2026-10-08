import fetch from 'isomorphic-unfetch'

export class ContractSwitchError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ContractSwitchError'
  }
}

export const isContractSwitchEnabled = true

const SWITCH_CONTRACT_TIMEOUT_MS = 30_000

/**
 * Switches the buyer's active contract through `/api/fs/switch-contract`.
 *
 * The route relays the call to VTEX Identity and answers with a single
 * `Set-Cookie` batch: the new auth cookie plus the expiry of the previous
 * contract's checkout orderForm cookies, which are `HttpOnly` and therefore
 * unreachable from here. Because both travel in the same response, there is no
 * window where the browser holds the new credential alongside the old
 * orderForm (B2BTEAM-3827).
 *
 * Throws `ContractSwitchError` on any failure so `switchContract` can keep the
 * previous contract active.
 */
export async function changeContractToken(
  contractId: string
): Promise<boolean> {
  if (!contractId) {
    throw new ContractSwitchError('Missing contractId for contract switch')
  }

  let response: Response
  try {
    response = await fetch('/api/fs/switch-contract', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ contractId }),
      signal: AbortSignal.timeout(SWITCH_CONTRACT_TIMEOUT_MS),
    })
  } catch (error) {
    if (
      error instanceof Error &&
      (error.name === 'TimeoutError' || error.name === 'AbortError')
    ) {
      throw new ContractSwitchError('Contract switch timed out')
    }

    throw error instanceof Error
      ? new ContractSwitchError(`Failed to switch contract: ${error.message}`)
      : new ContractSwitchError('Failed to switch contract')
  }

  if (!response.ok) {
    throw new ContractSwitchError(
      `Failed to switch contract (${response.status})`
    )
  }

  // Reading the body to completion guarantees the `Set-Cookie` headers are
  // committed before `switchContract` reloads the page.
  const payload = (await response.json().catch(() => null)) as {
    success?: boolean
  } | null

  if (!payload?.success) {
    throw new ContractSwitchError('Contract switch was not successful')
  }

  return true
}
