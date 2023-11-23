import type { State } from '../types'

const format = (params: State): URL => {
  const { page, selectedFacets, previousSelectedFacets, sort, term, base } = params
  let baseURL = base ?? ''

  const removedFacets =
    previousSelectedFacets?.filter(
      ({ key: previousKey }) =>
        !selectedFacets?.find(({ key }) => key === previousKey)
    ) ?? []

  const removedCategoryFacets =
    removedFacets?.filter(({ key }) => key?.startsWith('category-')) ?? []

  for (const { value } of removedCategoryFacets) {
    baseURL = baseURL?.replace(`/${value}`, '') ?? base
  }

  console.log('new URL', {
    base,
    baseURL,
    removedFacets,
    removedCategoryFacets
  })

  const url = new URL(baseURL, 'http://localhost')

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

  return url
}

export default format
