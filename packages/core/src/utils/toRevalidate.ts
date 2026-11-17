/**
 * Normalizes an ISR `revalidate` window read from the store config.
 *
 * Returns the value when it is a positive integer number of seconds, and
 * `false` otherwise. Next.js rejects `0`, negative and fractional windows at
 * render time, so those fall back to `false`, which keeps Next.js' default
 * for static pages: the page is cached until the next deploy.
 */
export function toRevalidate(value: unknown): number | false {
  return typeof value === 'number' && Number.isInteger(value) && value > 0
    ? value
    : false
}
