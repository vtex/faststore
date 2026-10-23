import { useRouter } from 'next/router'
import { useEffect } from 'react'

import { useSession } from '../session'

/**
 * A non-2xx BFF response reaches the client as `{ status }` (see
 * `ParseInvalidRequest`), while a 2xx one keeps the GraphQL `extensions`.
 */
export const isNotFound = (error: unknown) => {
  const { status, extensions } = (error ?? {}) as {
    status?: number
    extensions?: { type?: string }
  }

  return status === 404 || extensions?.type === 'NotFoundError'
}

/**
 * The PDP is statically generated without the shopper's session, so a B2B
 * contract assortment is only enforced when the client refetches the product.
 * Replaces the PDP with the store's 404 page when that refetch says the
 * product is not available to the shopper. The URL becomes `/404`: passing the
 * product path as the `as` argument would make Next load the PDP's data for
 * the 404 page, which expects a different shape and crashes.
 *
 * Restricted to B2B sessions: for other shoppers a failed refetch keeps
 * rendering the static product, as before.
 *
 * Returns whether the PDP must keep its loading state instead of the product's
 * price and buy button: while the redirect is pending, and while a not-found
 * answer waits for the session to tell whether the shopper is B2B. Without it,
 * the failed refetch falls back to the static product and its price shows
 * until the 404 page loads.
 */
export const useProductNotFoundRedirect = (error: unknown) => {
  const router = useRouter()
  const { b2b, isValidating: isSessionValidating } = useSession()
  const notFound = isNotFound(error)
  const shouldRedirect = Boolean(b2b) && notFound

  useEffect(() => {
    if (!shouldRedirect) return

    router.replace('/404')
  }, [shouldRedirect, router])

  return shouldRedirect || (notFound && isSessionValidating)
}
