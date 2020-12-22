/**
 * Most of this file is nonsense and should be moved to the backend to
 * decrease the TBT
 */
import { useContext, useMemo } from 'react'
import type { SearchFilterItem } from '@vtex/store-ui'

import { SearchContext } from './Provider'
import type { SearchFilters } from './Provider'

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
  value?: SearchFilterItem
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
      (item) =>
        item.value &&
        item.value.toLowerCase() === splittedQuery[i].toLowerCase()
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

        // Skip the root department facet selected
        const rootFacet = focusCategoryFacet(rawFacet as any, filters)

        if (rootFacet.value && facet.values) {
          const index = facet.values.findIndex(
            (value: any) => value.name === rootFacet.name
          )

          if (index >= 0) {
            facet.values?.splice(index, 1)
          }
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
