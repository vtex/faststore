import { useState } from 'react'

import { clearPersistedSessionState } from './clearPersistedSessionState'
import {
  ContractSwitchError,
  changeContractToken,
  isContractSwitchEnabled,
} from './changeContractToken'
import { isRefreshTokenSuccessful, refreshTokenRequest } from './refreshToken'

/**
 * Orchestrates a full change of commercial context (REQ-06).
 *
 * Steps:
 *  1. POST switch-properties with the target contract id.
 *  2. Refresh the storefront auth cookie so JWT claims (e.g. customerId) match.
 *  3. Clear persisted session state and reload the page.
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

      const refreshResult = await refreshTokenRequest()
      if (!isRefreshTokenSuccessful(refreshResult)) {
        throw new ContractSwitchError(
          'Failed to refresh authentication after contract switch'
        )
      }

      await clearPersistedSessionState()

      if (typeof globalThis.window !== 'undefined') {
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
