import type { Session } from '@faststore/sdk'

/** UI-only state that `useSession()` returns next to the session fields. */
export const SESSION_UI_KEYS = [
  'isSessionReady',
  'isValidating',
  'hasValidated',
] as const

export type SessionUIKey = (typeof SESSION_UI_KEYS)[number]

type SessionUIState = Partial<Record<SessionUIKey, boolean>>

/**
 * Returns the session without the UI-only state, as `IStoreSession` expects.
 * GraphQL rejects unknown input fields, so a session that carries them (e.g.
 * built from `useSession()` or persisted that way) fails every validation.
 */
export function toSessionInput(session: Session & SessionUIState): Session {
  const input = { ...session }

  for (const key of SESSION_UI_KEYS) {
    delete input[key]
  }

  return input
}
