import { useMemo } from 'react'

import type { Facet, SearchSort, State } from '../types'
import { SDKError } from '../utils/error'
import format from '../utils/format'

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
      type: 'setFacets'
      payload: Facet[]
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

const equals = (s1: State, s2: State) => format(s1).href === format(s2).href

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

    case 'setFacets':
      return state.selectedFacets !== action.payload
        ? { ...state, selectedFacets: action.payload }
        : state

    case 'removeFacet':
      return removeFacet(state, action.payload)

    case 'toggleFacet':
      return toggleFacet(state, action.payload)

    case 'toggleFacets':
      return toggleFacets(state, action.payload)

    default:
      throw new SDKError(`Unknown action of search state machine`)
  }
}

const dispatcher =
  (onChange: (url: URL) => void, state: State) => (action: Action) => {
    const newState = reducer(state, action)

    if (!equals(newState, state)) {
      onChange(format(newState))
    }
  }

export const useSearchState = (
  initialState: Partial<State>,
  onChange: (url: URL) => void
) => {
  const state = useMemo(() => initialize(initialState), [initialState])

  return useMemo(() => {
    const dispatch = dispatcher(onChange, state)

    return {
      state,
      setSort: (sort: SearchSort) =>
        dispatch({ type: 'setSort', payload: sort }),
      setTerm: (term: string | null) =>
        dispatch({ type: 'setTerm', payload: term }),
      setPage: (page: number) => dispatch({ type: 'setPage', payload: page }),
      setFacet: (facet: Facet, unique = false) =>
        dispatch({ type: 'setFacet', payload: { facet, unique } }),
      setFacets: (facets: Facet[]) =>
        dispatch({ type: 'setFacets', payload: facets }),
      removeFacet: (facet: Facet) =>
        dispatch({ type: 'removeFacet', payload: facet }),
      toggleFacet: (facet: Facet) =>
        dispatch({
          type: 'toggleFacet',
          payload: facet,
        }),
      toggleFacets: (facets: Facet[]) =>
        dispatch({ type: 'toggleFacets', payload: facets }),
    }
  }, [onChange, state])
}

export type UseSearchState = ReturnType<typeof useSearchState>
