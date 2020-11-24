export const uniqBy = <T>(array: T[], fn: (a: T) => string) => {
  const seen = new Set<string>()

  return array.reduce((acc, curr) => {
    const elem = fn(curr)

    if (!seen.has(elem)) {
      seen.add(elem)
      acc.push(curr)
    }

    return acc
  }, [] as T[])
}
