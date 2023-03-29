import { setFacet, toggleFacet, useSearch } from '@faststore/sdk'

import {
  FacetBoolean as UIFacetBoolean,
  FacetBooleanItem as UIFacetBooleanItem,
  FacetRange as UIFacetRange,
  Facets as UIFacets,
  Filter as UIFilter,
} from '@faststore/ui'
import type { Filter_FacetsFragment } from '@generated/graphql'
import { useFormattedPrice } from 'src/sdk/product/useFormattedPrice'
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
  /**
   * Title for the `FilterDesktop` component.
   */
  title?: string
}

function FilterDesktop({
  facets,
  testId,
  dispatch,
  expanded,
  title,
}: Props & ReturnType<typeof useFilter>) {
  const { resetInfiniteScroll, state, setState } = useSearch()

  return (
    <UIFilter
      testId={`desktop-${testId}`}
      title={title}
      indicesExpanded={expanded}
      onAccordionChange={(idx) =>
        dispatch({ type: 'toggleExpanded', payload: idx })
      }
    >
      {facets.map((facet, index) => {
        const { __typename: type, label } = facet
        const isExpanded = expanded.has(index)
        return (
          <UIFacets
            key={`${testId}-${label}-${index}`}
            testId={testId}
            index={index}
            type={type}
            label={label}
          >
            {type === 'StoreFacetBoolean' && isExpanded && (
              <UIFacetBoolean>
                {facet.values.map((item) => (
                  <UIFacetBooleanItem
                    key={`${testId}-${facet.label}-${item.label}`}
                    id={`${testId}-${facet.label}-${item.label}`}
                    testId={testId}
                    onFacetChange={(facet) => {
                      setState({
                        ...state,
                        selectedFacets: toggleFacet(
                          state.selectedFacets,
                          facet
                        ),
                        page: 0,
                      })
                      resetInfiniteScroll(0)
                    }}
                    selected={item.selected}
                    value={item.value}
                    quantity={item.quantity}
                    facetKey={facet.key}
                    label={item.label}
                  />
                ))}
              </UIFacetBoolean>
            )}
            {type === 'StoreFacetRange' && isExpanded && (
              <UIFacetRange
                facetKey={facet.key}
                min={facet.min}
                max={facet.max}
                formatter={useFormattedPrice}
                onFacetChange={(facet) => {
                  setState({
                    ...state,
                    selectedFacets: setFacet(state.selectedFacets, facet, true),
                    page: 0,
                  })
                  resetInfiniteScroll(0)
                }}
              />
            )}
          </UIFacets>
        )
      })}
    </UIFilter>
  )
}

export default FilterDesktop
