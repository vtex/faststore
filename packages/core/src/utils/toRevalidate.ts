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
    // JSON.stringify prints NaN and Infinity as `null` and throws on bigints,
    // so those are interpolated directly.
    const received =
      typeof value === 'number' || typeof value === 'bigint'
        ? `${value}`
        : JSON.stringify(value)

    console.warn(
      `[FastStore] Invalid ${key}: ${received}. Expected a positive integer number of seconds or false. The page will be cached until the next deploy.`
    )
  }

  return false
}
