import ClientCMS from '@vtex/client-cms'

/**
 * Query param added to the retry request. The CDN in front of the CMS API
 * includes the query string in its cache key, so a new value is a cache miss
 * that reaches the origin. A `Cache-Control: no-cache` request header is not
 * enough, since CDNs commonly ignore it.
 */
export const CACHE_BUST_PARAM = 'cb'

/**
 * The cache-busting value changes once per window instead of per request, so
 * retries for the same URL within a window share one CDN cache entry: at most
 * one of them reaches the origin, instead of every page generation causing a
 * new cache miss while the bad response stays cached under the original URL.
 */
export const CACHE_BUST_WINDOW_MS = 60 * 1000

/**
 * How long a URL whose cache-busting retry also failed skips further retries.
 *
 * Must be at least `CACHE_BUST_WINDOW_MS`: the next retry after the cooldown
 * has to fall in a later window, so it uses a new cache-busting value instead
 * of the one whose cached response just failed. Derived from it to keep that
 * invariant when either value changes.
 */
export const RETRY_COOLDOWN_MS = CACHE_BUST_WINDOW_MS

type ErrorShape = {
  name?: unknown
  type?: unknown
  cause?: { code?: unknown }
}

/**
 * Error codes Node raises while decompressing a response body: zlib (gzip,
 * deflate) uses `Z_*` (e.g. `Z_DATA_ERROR`, `Z_BUF_ERROR`), and brotli uses
 * `ERR_` + the decoder error name, which itself starts with an underscore (e.g.
 * `ERR__ERROR_FORMAT_PADDING_1`). The double underscore is not a typo.
 */
const BODY_DECODING_ERROR_CODE = /^(Z_|ERR__ERROR_)/

const decodingErrorCode = (error: unknown) => {
  const code = (error as ErrorShape | null)?.cause?.code

  return typeof code === 'string' && BODY_DECODING_ERROR_CODE.test(code)
    ? code
    : undefined
}

/**
 * Whether `error` means the response arrived but its body could not be parsed
 * or decoded:
 * - `SyntaxError`: `response.json()` on a body that is not valid JSON. Checked
 *   by name so it also matches errors created in another realm (e.g. a test vm
 *   context).
 * - A decoding error while reading the body, when `Content-Encoding` does not
 *   match the bytes: undici rejects with `TypeError: terminated`, caused by a
 *   zlib or brotli error.
 * - `invalid-json`: the parse failure as reported by `node-fetch`.
 *   `@vtex/client-cms` only falls back to it when there is no global fetch,
 *   which does not happen on the Node versions core supports (>= 20.9), so this
 *   case is only a safeguard.
 *
 * Bodies that parse to an unexpected value (e.g. `null`) are not retried: they
 * keep reaching callers as before.
 */
const isInvalidBodyError = (error: unknown) => {
  const { name, type } = (error ?? {}) as ErrorShape

  return (
    name === 'SyntaxError' ||
    type === 'invalid-json' ||
    decodingErrorCode(error) !== undefined
  )
}

/** Error name plus decoding code, without the message (it may embed body). */
const describeError = (error: unknown) =>
  [(error as ErrorShape | null)?.name, decodingErrorCode(error)]
    .filter(Boolean)
    .join(': ')

/**
 * `ClientCMS` that retries a request once, bypassing CDN caches, when the
 * response body cannot be parsed or decoded. A single bad cached response
 * (e.g. a compressed body stored without its `Content-Encoding`) would
 * otherwise fail every page that depends on it until the cache entry expires.
 *
 * Only that case is retried: network errors are already retried by
 * `@vtex/client-cms`, and non-2xx responses keep failing as before.
 *
 * The retry reaches the origin. When the retry fails too, for any reason (an
 * invalid body, a 5xx, a network error), the origin itself is likely unhealthy,
 * so that URL fails fast without retrying for `RETRY_COOLDOWN_MS` instead of
 * adding an uncached origin hit to every page generation. Skipping the retry
 * only falls back to the behavior without this class.
 */
export class ResilientClientCMS extends ClientCMS {
  /** URL -> time until which its cache-busting retry is skipped. */
  private readonly retryCooldownUntil = new Map<string, number>()

  async fetch<T>(path = '', params?: URLSearchParams): Promise<T> {
    try {
      return await super.fetch<T>(path, params)
    } catch (error) {
      if (!isInvalidBodyError(error)) {
        throw error
      }

      const url = [path, params?.toString()].filter(Boolean).join('?')
      if (this.isCoolingDown(url)) {
        throw error
      }

      // Only the error name (and decoding error code) is logged: a JSON parse
      // error message embeds the start of the body, which may be binary.
      console.warn(
        `[CMS] Invalid response body for "${url}" (${describeError(error)}). Retrying once bypassing the cache.`
      )

      const cacheBustingParams = new URLSearchParams(params)
      cacheBustingParams.set(
        CACHE_BUST_PARAM,
        Math.floor(Date.now() / CACHE_BUST_WINDOW_MS).toString()
      )

      try {
        return await super.fetch<T>(path, cacheBustingParams)
      } catch (retryError) {
        // Any retry failure backs off, not only another invalid body: a 5xx or
        // network error from the origin is also a reason not to add load.
        this.startCooldown(url)
        console.warn(
          `[CMS] Cache-busting retry failed for "${url}" (${describeError(retryError)}). Skipping retries for this URL for ${RETRY_COOLDOWN_MS / 1000}s.`
        )
        throw retryError
      }
    }
  }

  private isCoolingDown(url: string) {
    const until = this.retryCooldownUntil.get(url)

    if (until === undefined) {
      return false
    }

    if (until > Date.now()) {
      return true
    }

    this.retryCooldownUntil.delete(url)
    return false
  }

  private startCooldown(url: string) {
    const now = Date.now()

    // Drop expired entries so URLs that are never requested again do not pile
    // up for the lifetime of the process.
    this.retryCooldownUntil.forEach((until, key) => {
      if (until <= now) this.retryCooldownUntil.delete(key)
    })

    this.retryCooldownUntil.set(url, now + RETRY_COOLDOWN_MS)
  }
}
