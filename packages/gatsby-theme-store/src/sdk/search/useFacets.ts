/**
 * Most of this file is nonsense and should be moved to the backend to
 * decrease the TBT
 */
import { SearchFilterItem } from '@vtex/store-ui'
import { useContext, useMemo } from 'react'

import { SearchContext, SearchFilters } from './Provider'

const loadController = () => import('./controller')

const NAME_FROM_TYPE = {
  BRAND: 'Brand',
  CATEGORYTREE: 'Departments',
  TEXT: 'text',
  PRICERANGE: 'Price Ranges',
}

export interface Facet {
  name: string
  type: Vtex_FilterType
  values: SearchFilterItem[]
}

const focusCategoryFacet = (facet: Facet, filters: SearchFilters): Facet => {
  const { query, map } = filters

  const splittedQuery = query?.split('/')
  const splittedMap = map?.split(',')

  let focus = facet

  if (!splittedMap || !splittedQuery) {
    return focus
  }

  for (let i = 0; i < splittedMap.length; i++) {
    const m = splittedMap[i]

    if (m !== 'c') {
      return focus
    }

    const maybeFacet = focus.values.find(
      (item) => item.value.toLowerCase() === splittedQuery[i].toLowerCase()
    )

    if (!maybeFacet) {
      return focus
    }

    focus = (maybeFacet as unknown) as Facet
  }

  return focus
}

export const useFacets = () => {
  const {
    filters,
    data: {
      vtex: { facets: staticFacets },
    },
  } = useContext(SearchContext)

  const toggleItem = async (item: SearchFilterItem) => {
    const controller = await loadController()

    controller.toggleItem(item, filters)
  }

  const fixedFacets = useMemo(
    () =>
      staticFacets!.facets!.reduce((acc, rawFacet) => {
        const facet =
          rawFacet?.type === 'CATEGORYTREE'
            ? focusCategoryFacet(rawFacet as any, filters)
            : rawFacet

        // Skip empty facets
        if (!facet) {
          return acc
        }

        // Fill facet name
        facet!.name = facet!.name || (NAME_FROM_TYPE as any)[facet!.type!]

        acc.push(facet as Facet)

        return acc
      }, [] as Facet[]),
    [staticFacets, filters]
  )

  return {
    facets: fixedFacets,
    toggleItem,
  }
}
