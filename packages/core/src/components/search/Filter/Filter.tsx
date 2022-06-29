import { gql } from '@faststore/graphql-utils'
import { setFacet, toggleFacet, useSearch } from '@faststore/sdk'

import type { Filter_FacetsFragment } from '@generated/graphql'
import { useUI } from 'src/sdk/ui/Provider'

import Facets from './Facets'
import FilterSlider from './FilterSlider'
import { useFilter } from './useFilter'

interface Props {
  /**
   * The array that represents the details of every facet.
   */
  facets: Filter_FacetsFragment[]
  /**
   * ID to find this component in testing tools (e.g.: cypress,
   * testing-library, and jest).
   */
  testId?: string
}

function Filter({ facets: allFacets, testId = 'store-filter' }: Props) {
  const filter = useFilter(allFacets)
  const { resetInfiniteScroll, state, setState } = useSearch()
  const { filter: displayFilter } = useUI()
  const { facets, expanded, dispatch } = filter

  return (
    <>
      <div className="hidden-mobile">
        <Facets
          facets={facets}
          testId={`desktop-${testId}`}
          indicesExpanded={expanded}
          onFacetChange={(facet, type) => {
            setState({
              ...state,
              selectedFacets:
                type === 'BOOLEAN'
                  ? toggleFacet(state.selectedFacets, facet)
                  : setFacet(state.selectedFacets, facet, true),
              page: 0,
            })
            resetInfiniteScroll(0)
          }}
          onAccordionChange={(index) =>
            dispatch({ type: 'toggleExpanded', payload: index })
          }
        />
      </div>

      {displayFilter && <FilterSlider {...filter} testId={testId} />}
    </>
  )
}

export const fragment = gql`
  fragment Filter_facets on StoreFacet {
    ... on StoreFacetRange {
      key
      label

      min {
        selected
        absolute
      }

      max {
        selected
        absolute
      }

      __typename
    }
    ... on StoreFacetBoolean {
      key
      label
      values {
        label
        value
        selected
        quantity
      }

      __typename
    }
  }
`

export default Filter
