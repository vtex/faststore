export interface ParsedGQLTag {
  queries: Array<{
    query: string
    queryName: string
    queryId: string
    usedFragments: string[]
  }>
  fragments: Array<{
    fragment: string
    fragmentName: string
    fragmentId: string
    usedFragments: string[]
  }>
}

export function combinedIds(ids: string[]) {
  const [first, ...rest] = ids

  if (rest.length === 0) {
    return first
  }

  const chunkSize = Math.floor(first.length / ids.length)

  return (
    first.slice(0, chunkSize) +
    // eslint-disable-next-line @typescript-eslint/require-array-sort-compare
    rest
      .sort()
      .map((id) => id.slice(0, chunkSize))
      .join('')
  )
}
