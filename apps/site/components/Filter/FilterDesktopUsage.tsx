import { setFacet, useSearch } from '@faststore/sdk'

import {
  FacetBoolean,
  FacetBooleanItem,
  FacetRange,
  Facets,
  Filter,
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
          <Facets
            key={`${testId}-${label}-${index}`}
            testId={testId}
            index={index}
            type={type}
            label={label}
          >
            {type === 'StoreFacetBoolean' && isExpanded && (
              <FacetBoolean>
                {facet.values.map((item) => (
                  <FacetBooleanItem
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
              </FacetBoolean>
            )}
            {type === 'StoreFacetRange' && isExpanded && (
              <FacetRange
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
          </Facets>
        )
      })}
    </Filter>
  )
}

export default FilterDesktopUsage
