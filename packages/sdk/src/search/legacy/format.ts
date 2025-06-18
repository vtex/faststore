import type { State } from './state'

/**
 * @deprecated - DON'T USE \
 * Retro compatibility format code. \
 * prefer the one present at sdk/src/utils/format
 */
export function format(params: State): URL {
  const url = new URL(params.base, 'http://localhost')
  const { page, selectedFacets, sort, term, passThrough } = params

  if (term !== null) {
    url.searchParams.set('q', term)
  }

  const facets = new Set<string>()

  for (const facet of selectedFacets) {
    url.searchParams.append(facet.key, facet.value)
    facets.add(facet.key)
  }

  if (selectedFacets.length > 0) {
    url.searchParams.set('facets', Array.from(facets).join(','))
  }

  sort && url.searchParams.set('sort', sort)
  url.searchParams.set('page', (page ?? 0).toString())

  if (passThrough) {
    for (const [key, value] of passThrough.entries()) {
      url.searchParams.append(key, value)
    }
  }

  return url
}

export default format
