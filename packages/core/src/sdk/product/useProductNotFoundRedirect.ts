import { useRouter } from 'next/router'
import { useEffect } from 'react'

import { useSession } from '../session'

/**
 * A non-2xx BFF response reaches the client as `{ status }` (see
 * `ParseInvalidRequest`), while a 2xx one keeps the GraphQL `extensions`.
 */
const isNotFound = (error: unknown) => {
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
 */
export const useProductNotFoundRedirect = (error: unknown) => {
  const router = useRouter()
  const { b2b } = useSession()
  const shouldRedirect = Boolean(b2b) && isNotFound(error)

  useEffect(() => {
    if (!shouldRedirect) return

    router.replace('/404')
  }, [shouldRedirect, router])
}
