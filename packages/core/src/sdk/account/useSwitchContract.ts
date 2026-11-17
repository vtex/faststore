import { useState } from 'react'

import { clearPersistedSessionState } from './clearPersistedSessionState'
import {
  ContractSwitchError,
  changeContractToken,
  isContractSwitchEnabled,
} from './changeContractToken'

/**
 * Orchestrates a full change of commercial context (REQ-06).
 *
 * Steps:
 *  1. POST `/api/fs/switch-contract`, which swaps the auth cookie and expires
 *     the previous contract's checkout orderForm in one response. A failure
 *     here changes nothing, so the previous contract stays active.
 *  2. Clear persisted session and cart state and reload the page so
 *     validateSession/validateCart run under the new contract.
 */
export const useSwitchContract = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const switchContract = async (contractId: string): Promise<boolean> => {
    setLoading(true)
    setError(null)

    try {
      const switched = await changeContractToken(contractId)
      if (!switched) {
        setError(
          new ContractSwitchError('Contract switching is not available yet')
        )
        return false
      }

      // The cookies were already swapped, so the reload has to happen even if
      // clearing the local stores fails: from here on the server session is
      // the authoritative source and validateCart rebuilds the cart.
      try {
        await clearPersistedSessionState()
      } catch {}

      if (globalThis.window !== undefined) {
        globalThis.window.location.reload()
      }

      return true
    } catch (err) {
      const normalized =
        err instanceof Error
          ? err
          : new ContractSwitchError('Failed to switch contract')
      setError(normalized)

      return false
    } finally {
      setLoading(false)
    }
  }

  return {
    switchContract,
    loading,
    error,
    enabled: isContractSwitchEnabled,
  }
}
