const UNSAFE_CHARACTERS: Record<string, string> = {
  '<': '\\u003c',
  '>': '\\u003e',
  '&': '\\u0026',
  '\u2028': '\\u2028',
  '\u2029': '\\u2029',
}

/**
 * Serializes structured data for a `<script type="application/ld+json">`.
 *
 * Characters that could close the script tag or start an HTML comment are
 * written as JSON unicode escapes, so CMS-provided values can't break out of
 * the script, and parsers still read the original strings.
 */
export function serializeJsonLd(data: unknown) {
  return JSON.stringify(data).replace(
    /[<>&\u2028\u2029]/g,
    (char) => UNSAFE_CHARACTERS[char]
  )
}
