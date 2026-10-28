import { useRouter } from 'next/router'
import { useEffect, useRef } from 'react'

import { isProductNotFound } from './isProductNotFound'

/**
 * The PDP is statically generated without the shopper's session, so an
 * assortment restriction (e.g. a B2B contract limited to a collection) is only
 * enforced when the client refetches the product. Replaces the PDP with the
 * store's 404 page when that refetch says the product is not available to the
 * shopper. The URL becomes `/404`: passing the product path as the `as`
 * argument would make Next load the PDP's data for the 404 page, which expects
 * a different shape and crashes.
 *
 * Applies to every shopper: the API rejects the product from the
 * `vtex_segment` assortment, the same rule Intelligent Search applies to
 * listings, whether or not the session is B2B.
 *
 * Returns whether the PDP must keep its loading state instead of the product's
 * price and buy button while the redirect is pending. Without it, the failed
 * refetch falls back to the static product and its price shows until the 404
 * page loads.
 */
export const useProductNotFoundRedirect = (error: unknown) => {
  const router = useRouter()
  const shouldRedirect = isProductNotFound(error)
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

  return shouldRedirect
}
