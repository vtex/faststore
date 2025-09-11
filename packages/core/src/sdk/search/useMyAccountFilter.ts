import { setFacet, toggleFacet } from '@vtex/faststore-sdk'
import { useMemo, useReducer } from 'react'

export type SelectedFacet = {
  key: string
  value: string
}

interface State {
  expanded: Set<number>
  selected: SelectedFacet[]
}

type Action =
  | {
      type: 'toggleExpanded'
      payload: number
    }
  | {
      type: 'selectFacets'
      payload: SelectedFacet[]
    }
  | {
      type: 'toggleFacet'
      payload: SelectedFacet
    }
  | {
      type: 'setFacet'
      payload: { facet: SelectedFacet; unique?: boolean }
    }

export type MyAccountFilter_Facets_StoreFacetBoolean_Fragment = {
  __typename: 'StoreFacetBoolean'
  key: string
  label: string
  values: Array<{
    label: string
    value: string
    selected: boolean
    quantity: number
  }>
}

export type MyAccountFilter_Facets_StoreFacetRange_Fragment = {
  __typename: 'StoreFacetRange'
  key: string
  label: string
  from: string
  to: string
}

export type MyAccountFilter_Facets_StoreFacetPlacedBy_Fragment = {
  __typename: 'StoreFacetPlacedBy'
  key: string
  label: string
}

export type MyAccountFilter_FacetsFragment =
  | MyAccountFilter_Facets_StoreFacetBoolean_Fragment
  | MyAccountFilter_Facets_StoreFacetRange_Fragment
  | MyAccountFilter_Facets_StoreFacetPlacedBy_Fragment

const reducer = (state: State, action: Action) => {
  const { expanded, selected } = state
  const { type, payload } = action

  switch (type) {
    case 'toggleExpanded': {
      if (expanded.has(payload)) {
        expanded.delete(payload)
      } else {
        expanded.add(payload)
      }

      return {
        ...state,
        expanded: new Set(expanded),
      }
    }

    case 'selectFacets': {
      if (payload !== selected) {
        return {
          ...state,
          selected: payload,
        }
      }

      break
    }

    case 'toggleFacet': {
      return {
        ...state,
        selected: toggleFacet(state.selected, payload),
      }
    }

    case 'setFacet': {
      return {
        ...state,
        selected: setFacet(state.selected, payload.facet, payload.unique),
      }
    }

    default:
      throw new Error(`Action ${type} not implemented`)
  }

  return state
}

export const useMyAccountFilter = ({
  allFacets,
  selectedFacets,
}: {
  allFacets: MyAccountFilter_FacetsFragment[]
  selectedFacets: SelectedFacet[]
}) => {
  const [{ selected, expanded }, dispatch] = useReducer(reducer, null, () => ({
    expanded: new Set([0, 1]),
    selected: selectedFacets as SelectedFacet[],
  }))

  const selectedMap = useMemo(
    () =>
      selected.reduce(
        (acc, facet) => {
          if (!acc.has(facet.key)) {
            acc.set(facet.key, new Map())
          }

          acc.get(facet.key)?.set(facet.value, facet)

          return acc
        },
        new Map() as Map<string, Map<string, SelectedFacet>>
      ),
    [selected]
  )

  const facets = useMemo(
    () =>
      allFacets.map((facet) => {
        if (facet.__typename === 'StoreFacetBoolean') {
          return {
            ...facet,
            values: facet.values.map(({ value, ...rest }) => ({
              ...rest,
              value: value.toLowerCase(),
              selected: Boolean(
                selectedMap.get(facet.key)?.has(value.toLowerCase())
              ),
            })),
          }
        }

        return facet
      }),
    [allFacets, selectedMap]
  )

  return { facets, selected, expanded, dispatch }
}
