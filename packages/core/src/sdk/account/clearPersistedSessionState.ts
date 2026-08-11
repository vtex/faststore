import { SESSION_READY_KEY } from '../session/storageKeys'
import {
  STORAGE_KEY_CACHE_BUST_LAST_VALUE,
  STORAGE_KEY_PERSON_ID,
} from 'src/utils/cookieCacheBusting'

/**
 * Clears client-side session persistence so a hard reload rehydrates from
 * validateSession instead of stale IndexedDB / sessionStorage values.
 */
export async function clearPersistedSessionState(): Promise<void> {
  try {
    const { del } = await import('idb-keyval')
    await del('fs::session').catch(() => {})
  } catch {}

  if (typeof sessionStorage === 'undefined') {
    return
  }

  try {
    sessionStorage.removeItem(SESSION_READY_KEY)
    sessionStorage.removeItem(STORAGE_KEY_PERSON_ID)
    sessionStorage.removeItem(STORAGE_KEY_CACHE_BUST_LAST_VALUE)
  } catch {}
}
