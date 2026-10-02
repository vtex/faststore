import type { Session } from '@faststore/sdk'

/** UI-only state that `useSession()` returns next to the session fields. */
type SessionUIState = {
  isSessionReady?: boolean
  isValidating?: boolean
  hasValidated?: boolean
}

declare const sessionInputBrand: unique symbol

/** A session that went through `toSessionInput`, safe to send as `IStoreSession`. */
export type SessionInput = Session & { readonly [sessionInputBrand]: true }

/**
 * Mutation variables whose `session` must come from `toSessionInput`, so
 * passing `sessionStore.read()` or a `useSession()` spread does not compile.
 */
export type WithSessionInput<Variables extends { session: unknown }> = Omit<
  Variables,
  'session'
> & { session: SessionInput }

/**
 * Returns the session without the UI-only state, as `IStoreSession` expects.
 * GraphQL rejects unknown input fields, so a session that carries them (e.g.
 * built from `useSession()` or persisted that way) fails every validation.
 */
export function toSessionInput(
  session: Session & SessionUIState
): SessionInput {
  const { isSessionReady, isValidating, hasValidated, ...input } = session

  return input as SessionInput
}
