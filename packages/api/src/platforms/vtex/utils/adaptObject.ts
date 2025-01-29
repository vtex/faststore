export function adaptObject<T>(
  obj: Record<string, unknown>,
  predicate: (key: string, value: unknown) => boolean,
  keyFormatter: (key: string) => string = (key) => key,
  valueFormatter: (value: unknown) => T = (value) => value as T
): Record<string, T> {
  return Object.entries(obj).reduce(
    (acc, [key, value]) => {
      if (predicate(key, value)) {
        acc[keyFormatter(key)] = valueFormatter(value)
      }

      return acc
    },
    {} as Record<string, T>
  )
}
