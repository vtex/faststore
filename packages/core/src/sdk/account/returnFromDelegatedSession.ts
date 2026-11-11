import fetch from 'isomorphic-unfetch'

import { DelegatedSessionError } from './startDelegatedSession'

const DELEGATION_RETURN_TIMEOUT_MS = 30_000

/** The route answers 501 while Identity's Return API is not wired in yet. */
export const RETURN_NOT_AVAILABLE_STATUS = 501

/**
 * Ends an impersonation session through `/api/fs/delegation-return`, which
 * swaps the impersonated auth cookie for the Delegate's own and expires the
 * Original Shopper's orderForm cookies in a single `Set-Cookie` batch.
 *
 * Throws `DelegatedSessionError` on any failure, carrying the HTTP status when
 * there was one, so the current session stays untouched.
 */
export async function returnFromDelegatedSession(): Promise<true> {
  let response: Response
  try {
    response = await fetch('/api/fs/delegation-return', {
      method: 'POST',
      credentials: 'include',
      signal: AbortSignal.timeout(DELEGATION_RETURN_TIMEOUT_MS),
    })
  } catch (error) {
    throw new DelegatedSessionError(
      error instanceof Error && error.name === 'TimeoutError'
        ? 'Return from the delegated session timed out'
        : 'Failed to return from the delegated session'
    )
  }

  if (!response.ok) {
    throw new DelegatedSessionError(
      `Failed to return from the delegated session (${response.status})`,
      response.status
    )
  }

  // Reading the body to completion guarantees the `Set-Cookie` headers are
  // committed before the page reloads.
  const payload = (await response.json().catch(() => null)) as {
    success?: boolean
  } | null

  if (!payload?.success) {
    throw new DelegatedSessionError(
      'Return from the delegated session was not issued'
    )
  }

  return true
}
