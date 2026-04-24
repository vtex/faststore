import storeConfig from 'discovery.config'
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
 * Gets postalCode from session when deliveryPromise is enabled.
 * Reads session store directly since vtex_segment is httpOnly and inaccessible via JavaScript.
 * Returns null for stores that don't use delivery promise — postal code has no effect
 * on their facets, so there is no need to fragment the CDN cache by region.
 */
const getPostalCode = (): string | null => {
  if (typeof window === 'undefined' || !storeConfig.deliveryPromise?.enabled) {
    return null
  }
  const session = sessionStore.read() ?? sessionStore.readInitial()
  return session?.postalCode ?? null
}

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
 * Gets the postal code from sessionStorage (client-side only)
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
 * Stores the last value in sessionStorage (client-side only)
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
 * Clears the cache busting related data from sessionStorage (client-side only)
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

const buildValue = (
  personId: string | null,
  postalCode: string | null
): string => {
  const timestamp = Date.now().toString()
  return [timestamp, personId, postalCode].filter(Boolean).join('::')
}

/**
 * Gets cache busting value for client-side GET requests based on session state.
 *
 * Covers two axes that make GraphQL responses user/region-specific:
 * - Auth state (person.id): logged-in users see personalised prices and availability.
 * - Postal code: delivery-promise facets (shipping, delivery-options) differ per region.
 *
 * The value is appended as the `v` query param so the CDN treats each
 * combination as a distinct cache entry. Returns null when neither axis is set,
 * meaning the public CDN cache is shared across all anonymous visitors with no
 * location — which is the correct behaviour for stores without delivery promise.
 */
export const getClientCacheBustingValue = (): string | null => {
  const currentPersonId = getPersonId()
  const currentPostalCode = getPostalCode()

  // No session-specific data: clear storage and allow shared public CDN caching (don't proceed with cache busting logic)
  if (!currentPersonId && !currentPostalCode) {
    clearCacheBustingStorage()
    return null
  }

  const storedPersonId = getStoredPersonId()
  const storedPostalCode = getStoredPostalCode()

  // Either axis changed: persist new state and generate a fresh cache-busting value
  if (
    currentPersonId !== storedPersonId ||
    currentPostalCode !== storedPostalCode
  ) {
    storePersonId(currentPersonId)
    storePostalCode(currentPostalCode)
    const value = buildValue(currentPersonId, currentPostalCode)
    storeLastValue(value)
    return value
  }

  // Nothing changed: reuse existing value (or create one if storage was cleared)
  const lastValue = getLastValue()
  if (lastValue) {
    return lastValue
  }

  const value = buildValue(currentPersonId, currentPostalCode)
  storeLastValue(value)
  return value
}
