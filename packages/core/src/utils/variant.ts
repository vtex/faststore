export const VARIANT_QUERY_PARAM = '__variant'
export const VARIANT_PATH_PREFIX = '/_variant'

/**
 * Resolves the internal A/B variant route for an incoming request URL.
 *
 * When `__variant` is present and non-empty, returns the URL rewritten to
 * `/_variant/[branchId]/<original-path>` (querystring preserved). When it is
 * absent or empty, returns `null` so the request passes through untouched.
 *
 * Pure and side-effect free so the rewrite decision is unit-testable, and so
 * it can be composed into the Next.js `proxy` entrypoint without pulling in
 * any heavy dependencies.
 */
export function resolveVariantRewrite(url: URL): URL | null {
  const variant = url.searchParams.get(VARIANT_QUERY_PARAM)

  if (!variant) {
    return null
  }

  const rewritten = new URL(url)
  rewritten.pathname = `${VARIANT_PATH_PREFIX}/${variant}${url.pathname}`

  return rewritten
}
