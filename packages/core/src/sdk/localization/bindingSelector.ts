import type { Binding, Locale } from './types'

/**
 * Builds language options as Record<string, string> for direct use with UISelectField.
 * Uses "languageName (regionCode)" only when multiple locales share the same languageName.
 *
 * @param locales - Record of locale objects from discovery.config
 * @returns Record where key is locale code (e.g., "pt-BR") and value is display label (e.g., "Português (BR)")
 */
export function buildLanguageOptions(
  locales: Record<string, Locale>
): Record<string, string> {
  // Count occurrences of each languageName to determine disambiguation needs
  const languageCount: Record<string, number> = {}
  Object.values(locales).forEach((locale) => {
    languageCount[locale.languageName] =
      (languageCount[locale.languageName] || 0) + 1
  })

  // Build options with conditional disambiguation
  const options: Record<string, string> = {}
  Object.entries(locales).forEach(([code, locale]) => {
    const needsDisambiguation = languageCount[locale.languageName] > 1
    options[code] = needsDisambiguation
      ? `${locale.languageName} (${locale.regionCode})`
      : locale.languageName
  })

  return options
}

/**
 * Extracts unique currency codes from a locale's bindings.
 *
 * @param locale - The locale object containing bindings
 * @returns Array of unique currency codes (e.g., ["BRL", "USD"])
 */
export function getCurrenciesForLocale(locale: Locale): string[] {
  const currencies = new Set<string>()

  locale.bindings.forEach((binding) => {
    currencies.add(binding.currencyCode)
  })

  return Array.from(currencies)
}

/**
 * Resolves the correct binding for a locale+currency combination.
 * Applies isDefault tie-breaker when multiple bindings match.
 *
 * @param bindings - Array of bindings from a locale
 * @param currencyCode - The selected currency code to match
 * @returns The resolved binding, or null if no match found
 */
export function resolveBinding(
  bindings: Binding[],
  currencyCode: string
): Binding | null {
  const matches = bindings.filter((b) => b.currencyCode === currencyCode)

  if (matches.length === 0) return null
  if (matches.length === 1) return matches[0]

  // Multiple matches - apply isDefault tie-breaker
  return matches.find((b) => b.isDefault) ?? matches[0]
}

/**
 * Validates that a URL is non-empty and appears to be valid.
 *
 * @param url - The URL string to validate
 * @returns True if the URL is valid, false otherwise
 */
export function isValidUrl(url: string): boolean {
  if (!url || url.trim() === '') return false
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}
