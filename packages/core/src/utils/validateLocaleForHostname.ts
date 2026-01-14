import storeConfig from 'discovery.config.default.js'
import type { LocalesSettings } from '../typings/locales'

function getLocalesSettings(): LocalesSettings {
  return storeConfig.i18n as LocalesSettings
}

/**
 * A binding is valid if the hostname matches AND the locale code matches.
 * This works for both:
 * - Path-based bindings (e.g., "https://brandless.fast.store/pt-BR")
 * - Subdomain bindings (e.g., "https://canada.brandless.fast.store" for "fr-CA")
 *
 * @param hostname - The request hostname
 * @param localeCode - The locale code to check
 * @returns true if there's a valid binding for this hostname and locale, false otherwise
 */
function hasValidBindingForHostname(
  hostname: string,
  localeCode: string
): boolean {
  const localesSettings = getLocalesSettings()
  const localeData = localesSettings.locales[localeCode]

  if (!localeData?.bindings) {
    return false
  }

  return localeData.bindings.some((binding) => {
    if (!binding.url) return false

    try {
      const bindingUrl = new URL(binding.url)

      return bindingUrl.hostname === hostname
    } catch {
      return false
    }
  })
}

/**
 * Validates if a locale has a valid binding for the hostname.
 *
 * @param hostname - The request hostname
 * @param locale - The locale code (e.g., "fr-CA")
 * @returns true if the locale/hostname combination is valid, false otherwise
 */
export function validateLocaleForHostname(
  hostname: string,
  locale: string
): boolean {
  // Normalize hostname (remove port if present)
  const normalizedHostname = hostname.split(':')[0]

  // For localhost, allow all locales (useful for development)
  if (
    normalizedHostname === 'localhost' ||
    normalizedHostname === '127.0.0.1'
  ) {
    return true
  }

  return hasValidBindingForHostname(normalizedHostname, locale)
}
