import { useMemo, useReducer } from 'react'

import { SDKError } from '../utils/error'

export type SearchSort =
  | 'price_desc'
  | 'price_asc'
  | 'orders_desc'
  | 'name_desc'
  | 'name_asc'
  | 'release_desc'
  | 'discount_desc'
  | 'score_desc'

export interface Facet {
  key: string
  value: string
}

export interface State {
  /** @description search sorting criteria */
  sort: SearchSort
  /**
   * @description selected facets
   * */
  selectedFacets: Facet[]
  /** @description full text term */
  term: string | null
  /**
   * @description the base path url for the search context
   * */
  base: string
  /**
   * @description current pagination cursor
   */
  page: number
}

const sortKeys = new Set<SearchSort>([
  'price_desc',
  'price_asc',
  'orders_desc',
  'name_desc',
  'name_asc',
  'release_desc',
  'discount_desc',
  'score_desc',
])

export const initialize = ({
  sort = 'score_desc',
  selectedFacets = [],
  term = null,
  base = '/',
  page = 0,
}: Partial<State> | undefined = {}) => ({
  sort,
  selectedFacets,
  term,
  base: base.endsWith('/') ? base : `${base}/`,
  page,
})

const isSearchSort = (x: string): x is SearchSort => sortKeys.has(x as any)

type Action =
  | {
      type: 'setSort'
      payload: SearchSort
    }
  | {
      type: 'setTerm'
      payload: string | null
    }
  | {
      type: 'setPage'
      payload: number
    }
  | {
      type: 'setFacet'
      payload: { facet: Facet; unique: boolean }
    }
  | {
      type: 'removeFacet'
      payload: Facet
    }
  | {
      type: 'toggleFacet'
      payload: Facet
    }
  | {
      type: 'toggleFacets'
      payload: Facet[]
    }

const removeFacet = (state: State, facet: Facet): State => {
  const { value } = facet

  const index = state.selectedFacets.findIndex((x) => x.value === value)

  if (index < 0) {
    throw new SDKError(`Cannot remove ${value} from search params`)
  }

  // We can't allow removing the first facet, otherwise we would loose
  // the navigation context
  //
  // TODO: Remove returning the base selected facets to the frontend since
  // we won't be unselecting it anyways
  return {
    ...state,
    selectedFacets: state.selectedFacets.filter(
      (_, it) => it === 0 || it !== index
    ),
  }
}

export const setFacet = (
  state: State,
  facet: Facet,
  unique: boolean
): State => {
  if (unique === true) {
    const index = state.selectedFacets.findIndex((f) => f.key === facet.key)

    if (index > -1) {
      return {
        ...state,
        selectedFacets: state.selectedFacets.map((f, it) =>
          it === index ? facet : f
        ),
      }
    }
  }

  return {
    ...state,
    selectedFacets: [...state.selectedFacets, facet],
  }
}

const toggleFacet = (state: State, item: Facet) => {
  const found = state.selectedFacets.find(
    (facet) => facet.key === item.key && facet.value === item.value
  )

  if (found !== undefined) {
    return removeFacet(state, item)
  }

  return setFacet(state, item, false)
}

const toggleFacets = (state: State, items: Facet[]) =>
  items.reduce((item, s) => toggleFacet(item, s), state)

export const reducer = (state: State, action: Action) => {
  switch (action.type) {
    case 'setSort':
      if (!isSearchSort(action.payload)) {
        throw new SDKError(`Sort param ${action.payload} is unknown`)
      }

      return state.sort === action.payload
        ? state
        : {
            ...state,
            sort: action.payload,
          }

    case 'setTerm':
      return state.term === action.payload
        ? state
        : {
            ...state,
            term: action.payload,
          }

    case 'setPage':
      return state.page === action.payload
        ? state
        : {
            ...state,
            page: action.payload,
          }

    case 'setFacet':
      return setFacet(state, action.payload.facet, action.payload.unique)

    case 'removeFacet':
      return removeFacet(state, action.payload)

    case 'toggleFacet':
      return toggleFacet(state, action.payload)

    case 'toggleFacets':
      return toggleFacets(state, action.payload)

    default:
      throw new SDKError(`Uknown action of search state machine`)
  }
}

export const useSearchState = (initialState: Partial<State>) => {
  const [state, dispatch] = useReducer(reducer, initialState, initialize)

  return useMemo(
    () => ({
      state,
      setSort: (sort: SearchSort) =>
        dispatch({ type: 'setSort', payload: sort }),
      setTerm: (term: string | null) =>
        dispatch({ type: 'setTerm', payload: term }),
      setPage: (page: number) => dispatch({ type: 'setPage', payload: page }),
      setFacet: (facet: Facet, unique = false) =>
        dispatch({ type: 'setFacet', payload: { facet, unique } }),
      removeFacet: (facet: Facet) =>
        dispatch({ type: 'removeFacet', payload: facet }),
      toggleFacet: (facet: Facet) =>
        dispatch({
          type: 'toggleFacet',
          payload: facet,
        }),
      toggleFacets: (facets: Facet[]) =>
        dispatch({ type: 'toggleFacets', payload: facets }),
    }),
    [state]
  )
}

export type UseSearchState = ReturnType<typeof useSearchState>
