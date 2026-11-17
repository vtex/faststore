/**
 * Normalizes an ISR `revalidate` window read from the store config.
 *
 * Returns the value when it is a positive integer number of seconds, and
 * `false` otherwise, which keeps Next.js' default for static pages: the page
 * is cached until the next deploy. Next.js rejects `0`, negative and
 * fractional windows at render time, so those fall back to `false` with a
 * warning instead of breaking the page.
 *
 * @param value The configured window, e.g. `experimental.revalidatePLP`.
 * @param key The config key, used in the warning.
 */
export function toRevalidate(value: unknown, key: string): number | false {
  if (typeof value === 'number' && Number.isInteger(value) && value > 0) {
    return value
  }

  if (value !== false && value !== undefined && value !== null) {
    const received = describeValue(value)

    console.warn(
      `[FastStore] Invalid ${key}: ${received}. Expected a positive integer number of seconds or false. The page will be cached until the next deploy.`
    )
  }

  return false
}

/**
 * Describes a config value for a warning without ever throwing: objects can
 * be circular or hold bigints, which JSON.stringify rejects, so only their
 * type is printed.
 */
function describeValue(value: unknown): string {
  switch (typeof value) {
    case 'number':
    case 'bigint':
    case 'boolean':
      return `${value}`
    case 'string':
      return JSON.stringify(value)
    default:
      return `a value of type ${typeof value}`
  }
}
