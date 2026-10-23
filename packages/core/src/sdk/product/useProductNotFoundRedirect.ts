import { useRouter } from 'next/router'
import { useEffect, useRef } from 'react'

import { useSession } from '../session'
import { isProductNotFound } from './isProductNotFound'

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
  const notFound = isProductNotFound(error)
  const shouldRedirect = Boolean(b2b) && notFound
  // The router changes identity on route events, which re-runs the effect.
  // Navigate once per not-found so a pending redirect is not restarted.
  const hasRedirected = useRef(false)

  useEffect(() => {
    if (!shouldRedirect) {
      hasRedirected.current = false
      return
    }
    if (hasRedirected.current) return

    hasRedirected.current = true
    router.replace('/404')
  }, [shouldRedirect, router])

  return shouldRedirect || (notFound && isSessionValidating)
}
