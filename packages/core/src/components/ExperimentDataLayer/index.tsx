import { useEffect } from 'react'

/**
 * The PoC runs a single A/B experiment, so the experiment id is hardcoded.
 * When the program graduates beyond one experiment this should be sourced from
 * config or the edge alongside the variant cookie.
 */
export const EXPERIMENT_ID = 'ab-test-variant-branch'

/** Session cookie set by the edge with the assigned variant. */
export const EXPERIMENT_VARIANT_COOKIE = 'vtex_exp_variant'

export type ExperimentContext = {
  experiment_id: string
  variant_id: string
}

/** Reads a single cookie value from a `document.cookie` string. */
export function readCookie(
  name: string,
  cookieString: string
): string | undefined {
  const match = cookieString.match(new RegExp(`(?:^|;\\s*)${name}=([^;]*)`))
  return match ? decodeURIComponent(match[1]) : undefined
}

/**
 * Pushes the experiment context to the provided dataLayer when the variant
 * cookie is present. No-op when the cookie is absent so non-experiment traffic
 * is never tagged.
 */
export function pushExperimentContext(
  cookieString: string,
  dataLayer: Array<Record<string, unknown>>
): void {
  const variantId = readCookie(EXPERIMENT_VARIANT_COOKIE, cookieString)

  if (!variantId) {
    return
  }

  dataLayer.push({
    experiment_id: EXPERIMENT_ID,
    variant_id: variantId,
  } satisfies ExperimentContext)
}

/**
 * Client-side script that reads the `vtex_exp_variant` cookie set by the edge
 * and pushes the experiment context to `window.dataLayer`, so the existing
 * Activity Flow can tag events with the experiment/variant.
 */
function ExperimentDataLayer(): null {
  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    window.dataLayer = window.dataLayer ?? []
    pushExperimentContext(document.cookie, window.dataLayer)
  }, [])

  return null
}

export default ExperimentDataLayer
