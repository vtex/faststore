/**
 * Safe IDB storage interface. These try..catch are useful because
 * some browsers may block access to these APIs due to security policies
 *
 * Also, the stored value is lazy-loaded to avoid hydration mismatch
 * between server/browser. When state is 'hydrated', the value in the heap
 * is the same as the value in IDB
 */
import { get, set } from 'idb-keyval'
import type { Store } from './base'

const getIDB = async <T>(key: string) => {
  try {
    return await get<T>(key)
  } catch (err) {
    return
  }
}

const setIDB = async <T>(key: string, value: T) => {
  try {
    await set(key, value)
  } catch (err) {
    /** noop */
  }
}

const debounce = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
) => {
  let timeoutId: ReturnType<typeof setTimeout>
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => {
      func(...args)
    }, delay)
  }
}

export const persisted =
  <T>(key: string) =>
  (store: Store<T>) => {
    let hydrated = false

    const hydrateFromIDB = async () => {
      const payload = await getIDB<T>(key)

      if (typeof document !== 'undefined') {
        store.set(payload ?? store.readInitial())
      }

      hydrated = true
    }

    hydrateFromIDB()

    // Cross-tab sync: when the user returns to this tab, unconditionally
    // pull the latest value from IDB (another tab may have written it).
    const syncFromIDB = async () => {
      const payload = await getIDB<T>(key)

      if (typeof document !== 'undefined' && payload !== undefined) {
        store.set(payload)
      }
    }

    const debouncedSync = debounce(syncFromIDB, 100)

    globalThis.addEventListener?.('focus', () => debouncedSync())
    globalThis.document?.addEventListener(
      'visibilitychange',
      () => document.visibilityState === 'visible' && debouncedSync()
    )

    // Block IDB writes until the initial read completes.  This prevents a
    // race where an early store.set (from session sync, etc.) overwrites
    // saved data before it has been read back.
    store.subscribe((value) => {
      if (hydrated) {
        setIDB(key, value)
      }
    })

    return store
  }
