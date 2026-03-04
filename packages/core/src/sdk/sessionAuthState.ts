/**
 * Lightweight module to expose the current session's person ID for cache busting.
 * Uses a getter so we always read the current value from the session store at call time,
 * avoiding race conditions where requests fire before validateSession completes.
 */
type PersonIdGetter = () => string | null
let getPersonIdSource: PersonIdGetter = () => null

export const setCacheBustingSource = (fn: PersonIdGetter): void => {
  getPersonIdSource = fn
}

export const getSessionPersonId = (): string | null => getPersonIdSource()
