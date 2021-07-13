import { SDKError } from '../utils/error'
import type { Facet, SearchParamsState, SearchSort } from './state'

const sortKeys = new Set<SearchSort>([
  'price-desc',
  'price-asc',
  'orders-desc',
  'name-desc',
  'name-asc',
  'release-desc',
  'discount-desc',
  'score-desc',
])

interface FacetParam extends Facet {
  unique: boolean
}

const isSearchSort = (x: string): x is SearchSort => sortKeys.has(x as any)

const isFacetParam = (x: any): x is FacetParam => typeof x.unique === 'boolean'

export type SearchParam =
  | { key: 'sort'; value: SearchSort }
  | { key: 'term'; value: string | null }
  | { key: 'personalized'; value: boolean }
  | FacetParam

export const setSearchParam = (
  state: SearchParamsState,
  param: SearchParam
): SearchParamsState => {
  switch (param.key) {
    case 'sort':
      if (!isSearchSort(param.value)) {
        throw new SDKError(`Sort param ${param.value} is unknown`)
      }

      state.sort = param.value
      break

    case 'personalized':
      state.personalized = !!param.value
      break

    case 'term':
      state.term = param.value
      break

    case 'page':
      state.page = Number(param.value)
      break

    default:
      if (!isFacetParam(param)) {
        throw new SDKError(`Facet param must define if it's unique or not`)
      }

      if (param.unique === true) {
        const index = state.selectedFacets.findIndex(
          (facet) => facet.key === param.key
        )

        if (index > -1) {
          state.selectedFacets[index] = param

          break
        }
      }

      state.selectedFacets.push(param)
  }

  return state
}

export const removeSearchParam = (
  state: SearchParamsState,
  param: SearchParam
): SearchParamsState => {
  const { value } = param

  const index = state.selectedFacets.findIndex((x) => x.value === value)

  if (index > -1) {
    // We can't allow removing the first facet, otherwise we would loose
    // the navigation context
    //
    // TODO: Remove returning the base selected facets to the frontend since
    // we won't be unselecting it anyways
    if (index !== 0) {
      state.selectedFacets.splice(index, 1)
    }

    return state
  }

  throw new SDKError(`Cannot remove ${value} from search params`)
}
