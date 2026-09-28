/** Keeps `defaults` when an override is missing, empty, or whitespace-only. */
export function resolveNonBlankLabels<T extends Record<string, string>>(
  defaults: T,
  overrides?: Partial<T>
): T {
  const resolved = { ...defaults }

  if (!overrides) {
    return resolved
  }

  for (const key of Object.keys(defaults) as (keyof T)[]) {
    const value = overrides[key]

    if (typeof value === 'string' && value.trim().length > 0) {
      resolved[key] = value
    }
  }

  return resolved
}

/** Splits on the first `token`. A missing token leaves the whole string as `prefix`. */
export function splitOnFirstToken(template: string, token: string) {
  const index = template.indexOf(token)

  if (index === -1) {
    return { found: false as const, prefix: template, suffix: '' }
  }

  return {
    found: true as const,
    prefix: template.slice(0, index),
    suffix: template.slice(index + token.length),
  }
}
