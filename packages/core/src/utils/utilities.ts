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
 * textToTitleCase("EXAMPLE text!") // Example Text!
 * ```
 */
export function textToTitleCase(text: string | undefined): string {
  if (!text) return ''
  return text.replace(
    /\S+/g,
    (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
  )
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

export function extractStatusFromError(error: any): number | undefined {
  if (error?.extensions?.status) {
    return error.extensions.status
  }

  if (!error?.message) return undefined

  const matchMessage = error.message.match(/{.*}$/)
  if (!matchMessage) return undefined

  try {
    const parsed = JSON.parse(matchMessage[0])

    if (parsed.status) {
      return parsed.status
    }

    if (parsed.message) {
      const inner = JSON.parse(parsed.message)
      return inner.status
    }
  } catch {
    console.error('Failed to parse error message:', matchMessage[0])
  }

  return undefined
}

export function sanitizeHost(url: string): string {
  if (!url) return ''
  return url.replace(/^https?:\/\//, '')
}

export const buildFormData = (
  valueObject: Record<string, string | number | boolean | null | undefined>
) => {
  const form = new FormData()

  Object.keys(valueObject).forEach((key) => {
    const value = valueObject[key]
    form.append(key, value === null ? '' : String(value))
  })

  return form
}
/**
 * Converts a value to an array. If the value is already an array, returns it as-is.
 * If the value is undefined or null, returns an empty array.
 * Otherwise, wraps the value in an array.
 *
 * @param x - The value to convert to an array
 * @returns An array containing the value(s)
 */

export const toArray = <T>(x: T[] | T | undefined) =>
  Array.isArray(x) ? x : x ? [x] : []

/**
 * Formats the file name to a more user-friendly version.
 * @param fileName - The original file name.
 * @returns The formatted file name.
 * @example
 * formatFileName('smartphoneX5-23-256gb-black-edition-2023.xlsx')
 * // Returns: 'smartphoneX5-23...ck-edition-2023.xlsx'
 */
export function formatFileName(fileName: string): string {
  const maxLength = 30
  const extensionIndex = fileName.lastIndexOf('.')
  const extension = extensionIndex !== -1 ? fileName.slice(extensionIndex) : ''

  if (fileName.length <= maxLength) {
    return fileName
  }

  const nameWithoutExtension =
    extensionIndex !== -1 ? fileName.slice(0, extensionIndex) : fileName

  const availableBase = maxLength - extension.length

  if (availableBase <= 0) {
    // Extension alone exceeds maxLength; truncate from the end of the full name
    return fileName.slice(0, maxLength)
  }

  const ellipsis = '...'
  if (availableBase <= ellipsis.length) {
    return `${nameWithoutExtension.slice(0, availableBase)}${extension}`
  }

  const half = Math.floor((availableBase - ellipsis.length) / 2)
  const start = nameWithoutExtension.slice(0, half)
  const end = nameWithoutExtension.slice(
    -(availableBase - ellipsis.length - half)
  )
  const truncatedNameWithoutExtension = `${start}${ellipsis}${end}`

  return `${truncatedNameWithoutExtension}${extension}`
}

/**
 * Formats a file size in bytes to a human-readable string.
 * @param bytes - The file size in bytes.
 * @returns The formatted file size string.
 * @example
 * formatFileSize(2048) // Returns: '2 KB'
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return Number.parseFloat((bytes / k ** i).toFixed(2)) + ' ' + sizes[i]
}
