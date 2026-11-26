/**
 * Config keys already warned about in this process. `getStaticProps` runs on
 * every regeneration, so a per-call warning would repeat for every hot page.
 */
const warnedKeys = new Set<string>()

function warnOnce(key: string, message: string) {
  if (warnedKeys.has(key)) {
    return
  }

  warnedKeys.add(key)
  console.warn(message)
}

/**
 * Normalizes an ISR `revalidate` window read from the store config.
 *
 * Returns the value when it is a positive integer number of seconds, raised
 * to `min` when it is lower. Any other value returns `false`, which keeps
 * Next.js' default for static pages: the page is cached until the next
 * deploy. Next.js rejects `0`, negative and fractional windows at render
 * time, so those fall back to `false` with a warning instead of breaking the
 * page.
 *
 * @param value The configured window, e.g. `experimental.revalidatePLP`.
 * @param key The config key, used in the warnings.
 * @param options.min The shortest window allowed, in seconds. Defaults to 1.
 */
export function toRevalidate(
  value: unknown,
  key: string,
  { min = 1 }: { min?: number } = {}
): number | false {
  if (typeof value === 'number' && Number.isInteger(value) && value > 0) {
    if (value < min) {
      warnOnce(
        key,
        `[FastStore] ${key} is ${value}s. Using the minimum of ${min}s.`
      )

      return min
    }

    return value
  }

  if (value !== false && value !== undefined && value !== null) {
    warnOnce(
      key,
      `[FastStore] Invalid ${key}: ${describeValue(value)}. Expected a positive integer number of seconds or false. The page will be cached until the next deploy.`
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
