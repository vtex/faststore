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

type ErrorShape = {
  name?: unknown
  type?: unknown
  cause?: { code?: unknown }
}

/** zlib and brotli error codes raised while decompressing a response body. */
const BODY_DECODING_ERROR_CODE = /^(Z_|ERR__ERROR_FORMAT_|ERR_BROTLI)/

const decodingErrorCode = (error: unknown) => {
  const code = (error as ErrorShape | null)?.cause?.code

  return typeof code === 'string' && BODY_DECODING_ERROR_CODE.test(code)
    ? code
    : undefined
}

/**
 * Whether `error` means the response arrived but its body is unusable:
 * - `SyntaxError`: `response.json()` with the native fetch. Checked by name so
 *   it also matches errors created in another realm (e.g. a test vm context).
 * - `invalid-json`: the same failure with `node-fetch`, the fallback
 *   `@vtex/client-cms` uses when there is no global fetch.
 * - A decoding error while reading the body, when `Content-Encoding` does not
 *   match the bytes: undici rejects with `TypeError: terminated`, caused by a
 *   zlib or brotli error.
 */
const isInvalidBodyError = (error: unknown) => {
  const { name, type } = (error ?? {}) as ErrorShape

  return (
    name === 'SyntaxError' ||
    error instanceof InvalidCMSResponseError ||
    type === 'invalid-json' ||
    decodingErrorCode(error) !== undefined
  )
}

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

      // Only the error name (and decoding error code) is logged: a JSON parse
      // error message embeds the start of the body, which may be binary.
      const query = params?.toString()
      const code = decodingErrorCode(error)
      const reason = `${(error as Error).name}${code ? `: ${code}` : ''}`
      console.warn(
        `[CMS] Invalid response body for "${path}${query ? `?${query}` : ''}" (${reason}). Retrying once bypassing the cache.`
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
