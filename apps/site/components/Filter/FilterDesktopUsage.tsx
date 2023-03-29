import { setFacet, useSearch } from '@faststore/sdk'

import {
  Filter,
  FilterFacetBoolean,
  FilterFacetBooleanItem,
  FilterFacetRange,
  FilterFacets,
} from '@faststore/ui'
import { useFormattedPrice } from '../utilities/usePriceFormatter'
import { FilterFacet } from './FilterUsage'
import { useFilter } from './useFilter'

interface Props {
  /**
   * The array that represents the details of every facet.
   */
  facets: FilterFacet[]
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

function FilterDesktopUsage({
  facets,
  testId,
  dispatch,
  expanded,
  title,
}: Props & ReturnType<typeof useFilter>) {
  const { state, setState } = useSearch()

  return (
    <Filter
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
          <FilterFacets
            key={`${testId}-${label}-${index}`}
            testId={testId}
            index={index}
            type={type}
            label={label}
          >
            {type === 'StoreFacetBoolean' && isExpanded && (
              <FilterFacetBoolean>
                {facet.values.map((item) => (
                  <FilterFacetBooleanItem
                    key={`${testId}-${facet.label}-${item.label}`}
                    id={`${testId}-${facet.label}-${item.label}`}
                    testId={testId}
                    onFacetChange={(facet) => {
                      dispatch({ type: 'toggleFacet', payload: facet })
                    }}
                    selected={item.selected}
                    value={item.value}
                    quantity={item.quantity}
                    facetKey={facet.key}
                    label={item.label}
                  />
                ))}
              </FilterFacetBoolean>
            )}
            {type === 'StoreFacetRange' && isExpanded && (
              <FilterFacetRange
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
                }}
              />
            )}
          </FilterFacets>
        )
      })}
    </Filter>
  )
}

export default FilterDesktopUsage
