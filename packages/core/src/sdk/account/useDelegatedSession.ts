import { useState } from 'react'

import { clearPersistedSessionState } from './clearPersistedSessionState'
import { returnFromDelegatedSession } from './returnFromDelegatedSession'
import {
  DelegatedSessionError,
  startDelegatedSession,
} from './startDelegatedSession'

/**
 * The cookies were already swapped, so the reload has to happen even if
 * clearing the local stores fails.
 */
async function resetAndReload() {
  try {
    await clearPersistedSessionState()
  } catch {}

  if (globalThis.window !== undefined) {
    globalThis.window.location.reload()
  }
}

/**
 * Orchestrates entering and leaving an impersonation session.
 *
 *  1. POST to the route (`/api/fs/delegation-exchange` to enter,
 *     `/api/fs/delegation-return` to leave), which swaps the auth cookie and
 *     expires the previous orderForm in one response. A failure changes
 *     nothing.
 *  2. Clear persisted session and cart state and reload, so validateSession
 *     and validateCart run as the new effective user.
 */
export const useDelegatedSession = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const run = async (
    action: () => Promise<true>,
    fallbackMessage: string,
    onFailure?: (error: Error) => void | Promise<void>
  ): Promise<boolean> => {
    setLoading(true)
    setError(null)

    try {
      await action()
      await resetAndReload()

      return true
    } catch (err) {
      const failure =
        err instanceof Error ? err : new DelegatedSessionError(fallbackMessage)

      setError(failure)
      await onFailure?.(failure)

      return false
    } finally {
      setLoading(false)
    }
  }

  const startSession = (args: {
    originalUserId: string
    delegationId: string
  }): Promise<boolean> =>
    run(
      () => startDelegatedSession(args),
      'Failed to start the delegated session'
    )

  /**
   * `onFailure` receives the error after it is stored, so a caller can react
   * to a specific status (the banner uses it for "Return not available yet").
   */
  const returnToDelegate = (
    onFailure?: (error: Error) => void | Promise<void>
  ): Promise<boolean> =>
    run(
      returnFromDelegatedSession,
      'Failed to return from the delegated session',
      onFailure
    )

  return { startSession, returnToDelegate, loading, error }
}
