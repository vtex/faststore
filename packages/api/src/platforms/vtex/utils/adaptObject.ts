/**
 * Transforms an object's keys and values based on provided formatters and a predicate filter.
 *
 * @template T - The type of the transformed values.
 * @param obj - The object to transform.
 * @param predicate - A predicate function that determines whether a key-value pair should be included in the output.
 * @param keyFormatter - A function that formats the object keys. Defaults to returning the key as is.
 * @param valueFormatter - A function that formats the object values. Defaults to returning the value as is.
 * @returns A new object with transformed keys and values, including only the key-value pairs that satisfy the predicate.
 *
 * @example <caption>Select all keys that have a defined value and also makes all keys uppercase and all values as numbers</caption>
 * ```ts
 * const obj = { john: "25", will: "10", bob: undefined };
 * const result = adaptObject<number>(
 *   obj,
 *   (key, value) => value !== undefined,
 *   key => key.toUpperCase(),
 *   Integer.parseInt
 * );
 * console.log(result); // { JOHN: 25, WILL: 10 }
 * ```
 */
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
