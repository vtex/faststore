// Bounds how stale shared CMS content can get in long-lived processes (ISR);
// a CMS publish already triggers a new build.
export const CONTENT_CACHE_TTL_MS = 5 * 60 * 1000

type PromiseCacheEntry<T> = {
  expiresAt: number
  promise: Promise<T>
}

/**
 * Per-process memoization of async loaders. Concurrent callers share the
 * in-flight promise, entries expire after `ttlMs`, and rejections are evicted
 * so the next caller retries. When `shouldCache` rejects a resolved value, the
 * entry is evicted too, so only the callers already waiting share that value.
 */
export function createPromiseCache<T>(ttlMs = CONTENT_CACHE_TTL_MS) {
  const entries = new Map<string, PromiseCacheEntry<T>>()

  return {
    get(
      key: string,
      load: () => Promise<T>,
      shouldCache: (value: T) => boolean = () => true
    ): Promise<T> {
      const cached = entries.get(key)
      if (cached && cached.expiresAt > Date.now()) {
        return cached.promise
      }

      const evict = () => {
        if (entries.get(key)?.promise === promise) {
          entries.delete(key)
        }
      }

      const promise = load().then(
        (value) => {
          if (!shouldCache(value)) evict()
          return value
        },
        (err: unknown) => {
          evict()
          throw err
        }
      )

      entries.set(key, { expiresAt: Date.now() + ttlMs, promise })

      return promise
    },

    clear() {
      entries.clear()
    },
  }
}
