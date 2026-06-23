import { useState } from 'react'

import { cartStore } from '../cart'
import { sessionStore, validateSession } from '../session'
import {
  ContractSwitchError,
  changeContractToken,
  isContractSwitchEnabled,
} from './changeContractToken'

/**
 * Orchestrates a full change of commercial context (REQ-06).
 *
 * The switch is atomic from the buyer's perspective: the session and cart only
 * change once `ChangeToken` succeeds and the session has been revalidated. On any
 * failure the previous contract stays active (REQ-03 error handling).
 *
 * Steps:
 *  1. `changeContractToken` — flip the active contract token server-side.
 *  2. revalidate the FastStore session so `b2b` reflects the new contract.
 *  3. reset the in-flight cart (a switch is a full context change).
 */
export const useSwitchContract = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const switchContract = async (contractId: string): Promise<boolean> => {
    setLoading(true)
    setError(null)

    const previousSession = sessionStore.read()

    try {
      // 1. Full change of commercial context server-side.
      const switched = await changeContractToken(contractId)
      if (!switched) {
        setError(
          new ContractSwitchError('Contract switching is not available yet')
        )
        return false
      }

      // 2. Revalidate the session so the active contract reflects the new context.
      const revalidated = await validateSession(previousSession)
      if (revalidated) {
        sessionStore.set(revalidated)
      }

      // 3. A switch is a full context change: reset the in-flight cart.
      cartStore.emptyCart()

      return true
    } catch (err) {
      // Keep the previous contract active on failure.
      sessionStore.set(previousSession)

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
