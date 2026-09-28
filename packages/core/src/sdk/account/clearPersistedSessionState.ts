import { SESSION_READY_KEY } from '../session/storageKeys'
import {
  STORAGE_KEY_CACHE_BUST_LAST_VALUE,
  STORAGE_KEY_PERSON_ID,
} from 'src/utils/cookieCacheBusting'

/** Persisted `@faststore/sdk` stores that belong to the previous commercial context. */
export const PERSISTED_STORE_KEYS = ['fs::session', 'fs::cart'] as const

/**
 * Clears client-side persistence of the previous commercial context so a hard
 * reload rehydrates from validateSession / validateCart under the new
 * contract.
 *
 * The checkout orderForm cookies are `HttpOnly` and are expired by
 * `/api/fs/switch-contract` instead (B2BTEAM-3827).
 */
export async function clearPersistedSessionState(): Promise<void> {
  try {
    const { del } = await import('idb-keyval')
    await Promise.all(
      PERSISTED_STORE_KEYS.map((key) => del(key).catch(() => {}))
    )
  } catch {}

  if (typeof sessionStorage === 'undefined') return
  try {
    sessionStorage.removeItem(SESSION_READY_KEY)
    sessionStorage.removeItem(STORAGE_KEY_PERSON_ID)
    sessionStorage.removeItem(STORAGE_KEY_CACHE_BUST_LAST_VALUE)
  } catch {}
}
