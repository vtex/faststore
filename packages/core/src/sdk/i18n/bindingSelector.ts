import type { Binding, Locale } from './types'

/**
 * Builds display labels for locale codes for use in UI select fields.
 *
 * When multiple locales share the same languageName, the label includes the regionCode
 * in parentheses (e.g., "Português (BR)"); otherwise the label is just the languageName.
 *
 * @param locales - Mapping of locale code to locale objects as provided by discovery.config
 * @returns Mapping where each key is a locale code (e.g., "pt-BR") and each value is the display label (e.g., "Português" or "Português (BR)")
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
 * Selects the binding that matches a given currency code for a locale.
 *
 * If multiple bindings match the currency code, the binding with `isDefault === true` is chosen;
 * otherwise the first matching binding is returned.
 *
 * @param bindings - Array of bindings for the locale
 * @param currencyCode - The currency code to match (e.g., "USD")
 * @returns The matching `Binding`, preferring one with `isDefault === true` when multiple matches exist, or `null` if no match is found
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
 * Determines whether a string is a non-empty, well-formed URL.
 *
 * @param url - The string to validate as a URL
 * @returns `true` if `url` is non-empty and parses as a URL, `false` otherwise
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