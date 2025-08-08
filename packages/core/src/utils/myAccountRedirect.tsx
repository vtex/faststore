import storeConfig from 'faststore-config'
import type { ParsedUrlQuery } from 'querystring'

/**
 * Check if the Faststore My Account feature flag is enabled.
 * If not, redirect to the legacy My Account URL with the query parameters.
 *
 * @param {ParsedUrlQuery} query - The query parameters from the request.
 * @returns {Object} - An object containing the feature flag status and redirect information.
 */
export function getMyAccountRedirect({ query }: { query: ParsedUrlQuery }): {
  isFaststoreMyAccountEnabled: boolean
  redirect: { destination: string; permanent: boolean } | null
} {
  const isFaststoreMyAccountEnabled =
    storeConfig.experimental?.enableFaststoreMyAccount

  if (!isFaststoreMyAccountEnabled) {
    const searchParams = new URLSearchParams()

    for (const key in query) {
      const value = query[key]
      const values = Array.isArray(value) ? value : [value]
      values.forEach((v) => v && searchParams.append(key, v))
    }

    const redirect = {
      destination: `${storeConfig.accountUrl}${searchParams.toString().length > 0 ? '?' + searchParams.toString() : ''}`,
      permanent: false,
    }

    return { isFaststoreMyAccountEnabled, redirect }
  }

  return { isFaststoreMyAccountEnabled, redirect: null }
}
