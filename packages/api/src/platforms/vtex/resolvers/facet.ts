import type { Resolver } from '..'
import type {
  Facet,
  FacetValueBoolean,
  FacetValueRange,
} from '../clients/search/types/FacetSearchResult'
import { parseRange } from '../utils/facets'
import { min } from '../utils/orderStatistics'

export type Root = Facet

export const StoreFacet: Record<string, Resolver<Root>> = {
  __resolveType: ({ type, values }) => {
    if (type !== 'TEXT' && type !== 'DELIVERY') {
      return 'StoreFacetRange'
    }

    if (!values || values.length === 0) {
      return 'StoreFacetBoolean'
    }

    if (values.every((value) => (value as FacetValueRange).range)) {
      return 'StoreFacetRange'
    }

    return 'StoreFacetBoolean'
  },
}

export const StoreFacetBoolean: Record<
  string,
  Resolver<Facet<FacetValueBoolean>>
> = {
  key: ({ key }) => key,
  label: ({ name }) => name,
  values: ({ values }) => values.sort((a, b) => a.name.localeCompare(b.name)),
}

export const StoreFacetRange: Record<
  string,
  Resolver<Facet<FacetValueRange>>
> = {
  key: ({ key }) => key,
  label: ({ name }) => name,
  min: ({ values, key }, _, { storage: { searchArgs } }) => {
    /**
     * Fetch the selected range the user queried.
     *
     * This is necessary because, differently from boolean facets, Search API does
     * not return the selected values, making us have to implement it in here
     */
    const selectedRange = parseRange(
      searchArgs?.selectedFacets?.find((facet) => facet.key === key)?.value ??
        ''
    )

    const facet = min(values, (a, b) => a.range.from - b.range.from)
    const globalMin = facet?.range?.from ?? 0

    return {
      selected: selectedRange?.[0] ?? globalMin,
      absolute: globalMin,
    }
  },
  max: ({ values, key }, _, { storage: { searchArgs } }) => {
    /**
     * Fetch the selected range the user queried.
     *
     * This is necessary because, differently from boolean facets, Search API does
     * not return the selected values, making us have to implement it in here
     */
    const selectedRange = parseRange(
      searchArgs?.selectedFacets?.find((facet) => facet.key === key)?.value ??
        ''
    )

    const facet = min(values, (a, b) => b.range.to - a.range.to)
    const globalMax = facet?.range?.to ?? 0

    return {
      selected: selectedRange?.[1] ?? globalMax,
      absolute: globalMax,
    }
  },
}
