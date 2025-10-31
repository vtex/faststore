/**
 * List of RTL (Right-to-Left) language codes
 */
const RTL_LANGUAGES = [
  'ar', // Arabic
  'he', // Hebrew
  'fa', // Persian (Farsi)
  'ur', // Urdu
  'yi', // Yiddish
]

/**
 * Extracts the language code from a locale string
 * @param locale - Locale string (e.g., 'ar-SA', 'en-US')
 * @returns Language code (e.g., 'ar', 'en')
 */
function getLanguageCode(locale: string): string {
  return locale.split('-')[0].toLowerCase()
}

/**
 * Checks if a locale is RTL (Right-to-Left)
 * @param locale - Locale string (e.g., 'ar-SA', 'en-US')
 * @returns True if the locale is RTL, false otherwise
 */
export function isRTL(locale: string): boolean {
  const languageCode = getLanguageCode(locale)
  return RTL_LANGUAGES.includes(languageCode)
}

/**
 * Gets the text direction for a locale
 * @param locale - Locale string (e.g., 'ar-SA', 'en-US')
 * @returns 'rtl' or 'ltr'
 */
export function getTextDirection(locale: string): 'rtl' | 'ltr' {
  return isRTL(locale) ? 'rtl' : 'ltr'
}
