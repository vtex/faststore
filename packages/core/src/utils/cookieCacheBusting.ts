import { sessionStore } from 'src/sdk/session'

export const STORAGE_KEY_PERSON_ID = 'faststore_person_id'
export const STORAGE_KEY_CACHE_BUST_LAST_VALUE =
  'faststore_cache_bust_last_value'

/**
 * Gets person?.id from session (via ValidateSession).
 * Reads session store directly since auth cookies are httpOnly and inaccessible via JavaScript.
 */
const getPersonId = (): string | null => {
  if (typeof window === 'undefined') {
    return null
  }
  const session = sessionStore.read() ?? sessionStore.readInitial()
  return session?.person?.id ?? null
}

/**
 * Gets the stored person id from sessionStorage (client-side only)
 */
const getStoredPersonId = (): string | null => {
  if (typeof sessionStorage === 'undefined') {
    return null
  }

  try {
    return sessionStorage.getItem(STORAGE_KEY_PERSON_ID)
  } catch {
    return null
  }
}

/**
 * Stores the person id in sessionStorage (client-side only)
 */
const storePersonId = (value: string | null): void => {
  if (typeof sessionStorage === 'undefined') {
    return
  }

  try {
    if (value === null) {
      sessionStorage.removeItem(STORAGE_KEY_PERSON_ID)
    } else {
      sessionStorage.setItem(STORAGE_KEY_PERSON_ID, value)
    }
  } catch {
    // Ignore storage errors
  }
}

/**
 * Gets the last cache busting value from sessionStorage (client-side only)
 */
const getLastValue = (): string | null => {
  if (typeof sessionStorage === 'undefined') {
    return null
  }

  try {
    return sessionStorage.getItem(STORAGE_KEY_CACHE_BUST_LAST_VALUE)
  } catch {
    return null
  }
}

/**
 * Stores the last cache busting value in sessionStorage (client-side only)
 */
const storeLastValue = (value: string): void => {
  if (typeof sessionStorage === 'undefined') {
    return
  }

  try {
    sessionStorage.setItem(STORAGE_KEY_CACHE_BUST_LAST_VALUE, value)
  } catch {
    // Ignore storage errors
  }
}

/**
 * Clears all cache busting related data from sessionStorage (client-side only)
 */
const clearCacheBustingStorage = (): void => {
  if (typeof sessionStorage === 'undefined') {
    return
  }

  try {
    sessionStorage.removeItem(STORAGE_KEY_PERSON_ID)
    sessionStorage.removeItem(STORAGE_KEY_CACHE_BUST_LAST_VALUE)
  } catch {
    // Ignore storage errors
  }
}

/**
 * Gets cache busting value for client-side based on auth state changes.
 * Uses person?.id from session (via useSession/ValidateSession) since auth cookies
 * are now httpOnly and cannot be accessed via JavaScript.
 */
export const getClientCacheBustingValue = (): string | null => {
  const currentPersonId = getPersonId()

  // Guard clause: if user is not logged in (no person?.id), clear storage and don't proceed with cache busting logic
  if (currentPersonId === null) {
    clearCacheBustingStorage()
    return null
  }

  const storedPersonId = getStoredPersonId()

  // If person changed (login/logout or different user), update stored value and return new value
  if (currentPersonId !== storedPersonId) {
    storePersonId(currentPersonId)
    const timestamp = Date.now().toString()
    const value = `${timestamp}::${currentPersonId}`
    storeLastValue(value)
    return value
  }

  // Person hasn't changed, return last value or create one if it doesn't exist
  const lastValue = getLastValue()
  if (lastValue) {
    return lastValue
  }

  // Fallback: if no last value, create one
  const timestamp = Date.now().toString()
  const value = `${timestamp}::${currentPersonId}`
  storeLastValue(value)
  return value
}
