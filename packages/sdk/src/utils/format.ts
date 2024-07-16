import type { State } from '../types'

const format = (params: State): URL => {
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

  url.searchParams.set('sort', sort)
  url.searchParams.set('page', page.toString())

  if (passThrough && passThrough.size > 0) {
    const entriesArray = Array.from(passThrough.entries())
    for (const [key, value] of entriesArray) {
      url.searchParams.append(key, value)
    }
  }

  return url
}

export default format
