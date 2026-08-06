import type { Store } from '@faststore/sdk'

/** Max time to wait for the first validateSession before validating the cart. */
export const SESSION_VALIDATION_WAIT_MS = 3_000

/**
 * Defers cart validation until session has been validated at least once, so
 * `session.channel` (sales channel) is less likely to be stale relative to
 * Session Manager / external flows like Quick Order.
 */
export const waitForSessionValidated = async (
  hasValidatedSessionStore: Store<boolean>,
  waitMs = SESSION_VALIDATION_WAIT_MS
): Promise<void> => {
  if (hasValidatedSessionStore.read()) {
    return
  }

  await new Promise<void>((resolve) => {
    const timeoutId = setTimeout(() => {
      unsubscribe()
      resolve()
    }, waitMs)

    const unsubscribe = hasValidatedSessionStore.subscribe((validated) => {
      if (!validated) {
        return
      }

      clearTimeout(timeoutId)
      unsubscribe()
      resolve()
    })

    // Race: validation may have finished between read() and subscribe()
    if (hasValidatedSessionStore.read()) {
      clearTimeout(timeoutId)
      unsubscribe()
      resolve()
    }
  })
}
