/**
 * @description Converts a string to kebab case.
 * @param text - The string to convert.
 * @returns The string in kebab case.
 * @example
 * ```ts
 * textToKebabCase("Example Text!") // example-text
 * ```
 */
export function textToKebabCase(text: string): string {
  // Replace spaces and special characters with hyphens
  let kebabCase = text.replace(/[^\w\s]/gi, '-')

  // Remove whitespace
  kebabCase = kebabCase.replace(/\s+/g, '-')

  // Convert to lowercase
  kebabCase = kebabCase.toLowerCase()

  return kebabCase ?? ''
}

/**
 * @description Converts a string to title case.
 * @param text - The string to convert.
 * @returns The string in title case.
 * @example
 * ```ts
 * textToTitleCase("example text!") // Example Text
 * ```
 */
export function textToTitleCase(text: string | undefined): string {
  if (!text) return ''

  // Split the text into words
  const words = text.split(' ')

  // Capitalize the first letter of each word
  const titleCased = words
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')

  return titleCased
}

/**
 * @description Converts a camel case string to title case.
 * @param str - The camel case string to convert.
 * @returns The string in title case.
 * @example
 * ```ts
 * camelCaseToTitle("exampleText") // Example Text
 * ```
 */
export function camelCaseToTitle(str: string): string {
  if (!str) return ''
  const withSpaces = str.replace(/([a-z])([A-Z])/g, '$1 $2')
  return withSpaces.charAt(0).toUpperCase() + withSpaces.slice(1)
}
