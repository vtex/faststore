import ClientCMS from '@vtex/client-cms'

/**
 * Query param added to the retry request. The CDN in front of the CMS API
 * includes the query string in its cache key, so a new value is a cache miss
 * that reaches the origin. A `Cache-Control: no-cache` request header is not
 * enough, since CDNs commonly ignore it.
 */
export const CACHE_BUST_PARAM = 'cb'

export class InvalidCMSResponseError extends Error {
  constructor(path: string) {
    super(`Invalid CMS API response body for "${path}"`)
    this.name = 'InvalidCMSResponseError'
    // Keeps `instanceof` working when compiled to ES5.
    Object.setPrototypeOf(this, InvalidCMSResponseError.prototype)
  }
}

/**
 * `response.json()` throws a `SyntaxError` with the native fetch, and a
 * `FetchError` of type `invalid-json` with `node-fetch` (the fallback
 * `@vtex/client-cms` uses when there is no global fetch).
 */
const isInvalidBodyError = (error: unknown) =>
  error instanceof SyntaxError ||
  error instanceof InvalidCMSResponseError ||
  (error as { type?: unknown } | null)?.type === 'invalid-json'

const assertValidBody = <T>(body: T, path: string): T => {
  // Every CMS API endpoint answers with a JSON object.
  if (body === null || typeof body !== 'object') {
    throw new InvalidCMSResponseError(path)
  }

  return body
}

/**
 * `ClientCMS` that retries a request once, bypassing CDN caches, when the
 * response body is not valid JSON. A single bad cached response (e.g. a
 * compressed body stored without its `Content-Encoding`) would otherwise fail
 * every page that depends on it until the cache entry expires.
 *
 * Only the invalid-body case is retried: network errors are already retried by
 * `@vtex/client-cms`, and non-2xx responses keep failing as before.
 */
export class ResilientClientCMS extends ClientCMS {
  async fetch<T>(path = '', params?: URLSearchParams): Promise<T> {
    try {
      return assertValidBody(await super.fetch<T>(path, params), path)
    } catch (error) {
      if (!isInvalidBodyError(error)) {
        throw error
      }

      // Only the error name is logged: a JSON parse error message embeds the
      // start of the body, which may be binary.
      const query = params?.toString()
      console.warn(
        `[CMS] Invalid response body for "${path}${query ? `?${query}` : ''}" (${
          (error as Error).name
        }). Retrying once bypassing the cache.`
      )

      const cacheBustingParams = new URLSearchParams(params)
      cacheBustingParams.set(CACHE_BUST_PARAM, Date.now().toString())

      return assertValidBody(
        await super.fetch<T>(path, cacheBustingParams),
        path
      )
    }
  }
}
