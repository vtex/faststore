import fetch from 'isomorphic-unfetch'

export class DelegatedSessionError extends Error {
  /** HTTP status of the failed route call, when there was one. */
  status?: number

  constructor(message: string, status?: number) {
    super(message)
    this.name = 'DelegatedSessionError'
    this.status = status
  }
}

const DELEGATION_EXCHANGE_TIMEOUT_MS = 30_000

/**
 * Starts an impersonation session through `/api/fs/delegation-exchange`.
 *
 * The route answers with a single `Set-Cookie` batch: the impersonated auth
 * cookie plus the expiry of the Delegate's checkout orderForm cookies, which
 * are `HttpOnly` and unreachable from here.
 *
 * Throws `DelegatedSessionError` on any failure so the Delegate's own session
 * stays untouched.
 */
export async function startDelegatedSession({
  originalUserId,
  delegationId,
}: {
  originalUserId: string
  delegationId: string
}): Promise<true> {
  if (!originalUserId || !delegationId) {
    throw new DelegatedSessionError('Missing delegation data')
  }

  let response: Response
  try {
    response = await fetch('/api/fs/delegation-exchange', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ originalUserId, delegationId }),
      signal: AbortSignal.timeout(DELEGATION_EXCHANGE_TIMEOUT_MS),
    })
  } catch (error) {
    throw new DelegatedSessionError(
      error instanceof Error && error.name === 'TimeoutError'
        ? 'Delegated session timed out'
        : 'Failed to start the delegated session'
    )
  }

  if (!response.ok) {
    throw new DelegatedSessionError(
      `Failed to start the delegated session (${response.status})`
    )
  }

  // Reading the body to completion guarantees the `Set-Cookie` headers are
  // committed before the page reloads.
  const payload = (await response.json().catch(() => null)) as {
    success?: boolean
  } | null

  if (!payload?.success) {
    throw new DelegatedSessionError('Delegated session was not issued')
  }

  return true
}
