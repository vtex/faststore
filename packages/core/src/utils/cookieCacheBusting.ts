import { sessionStore } from 'src/sdk/session'

export const STORAGE_KEY_PERSON_ID = 'faststore_person_id'
export const STORAGE_KEY_POSTAL_CODE = 'faststore_postal_code'
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
 * Gets postalCode from session (via ValidateSession / region).
 */
const getPostalCodeFromSession = (): string | null => {
  if (typeof window === 'undefined') {
    return null
  }
  const session = sessionStore.read() ?? sessionStore.readInitial()
  const postal = session?.postalCode?.trim()
  return postal || null
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
 * Gets the stored postal code from sessionStorage (client-side only)
 */
const getStoredPostalCode = (): string | null => {
  if (typeof sessionStorage === 'undefined') {
    return null
  }

  try {
    return sessionStorage.getItem(STORAGE_KEY_POSTAL_CODE)
  } catch {
    return null
  }
}

/**
 * Stores the postal code in sessionStorage (client-side only)
 */
const storePostalCode = (value: string | null): void => {
  if (typeof sessionStorage === 'undefined') {
    return
  }

  try {
    if (value === null) {
      sessionStorage.removeItem(STORAGE_KEY_POSTAL_CODE)
    } else {
      sessionStorage.setItem(STORAGE_KEY_POSTAL_CODE, value)
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
    sessionStorage.removeItem(STORAGE_KEY_POSTAL_CODE)
    sessionStorage.removeItem(STORAGE_KEY_CACHE_BUST_LAST_VALUE)
  } catch {
    // Ignore storage errors
  }
}

const buildCacheBustValue = (
  timestamp: string,
  personId: string | null,
  postalCode: string | null
) => `${timestamp}::${personId ?? ''}::${postalCode ?? ''}`

/**
 * Gets cache busting value for client-side when session identity for caching changes.
 * Uses person?.id and postalCode from session (via useSession/ValidateSession): auth cookies
 * are httpOnly, but the session store reflects validated session including region.
 */
export const getClientCacheBustingValue = (): string | null => {
  const currentPersonId = getPersonId()
  const currentPostalCode = getPostalCodeFromSession()

  if (currentPersonId === null && currentPostalCode === null) {
    clearCacheBustingStorage()
    return null
  }

  const storedPersonId = getStoredPersonId()
  const storedPostalCode = getStoredPostalCode()

  const personChanged = currentPersonId !== storedPersonId
  const postalChanged = currentPostalCode !== storedPostalCode

  if (personChanged || postalChanged) {
    if (personChanged) {
      storePersonId(currentPersonId)
    }
    if (postalChanged) {
      storePostalCode(currentPostalCode)
    }
    const timestamp = Date.now().toString()
    const value = buildCacheBustValue(
      timestamp,
      currentPersonId,
      currentPostalCode
    )
    storeLastValue(value)
    return value
  }

  const lastValue = getLastValue()
  if (lastValue) {
    return lastValue
  }

  const timestamp = Date.now().toString()
  const value = buildCacheBustValue(
    timestamp,
    currentPersonId,
    currentPostalCode
  )
  storeLastValue(value)
  return value
}
