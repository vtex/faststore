import type { Session } from '@faststore/sdk'

/** UI-only state that `useSession()` returns next to the session fields. */
type SessionUIState = {
  isSessionReady?: boolean
  isValidating?: boolean
  hasValidated?: boolean
}

/**
 * Returns the session without the UI-only state, as `IStoreSession` expects.
 * GraphQL rejects unknown input fields, so a session that carries them (e.g.
 * built from `useSession()` or persisted that way) fails every validation.
 */
export function toSessionInput(session: Session & SessionUIState): Session {
  const { isSessionReady, isValidating, hasValidated, ...input } = session

  return input
}
