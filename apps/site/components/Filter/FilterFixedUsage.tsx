import { setFacet, useSearch } from '@faststore/sdk'

import {
  FacetBoolean as UIFacetBoolean,
  FacetBooleanItem as UIFacetBooleanItem,
  FacetRange as UIFacetRange,
  Facets as UIFacets,
  Filter as UIFilter,
} from '@faststore/ui'
import { useFormattedPrice } from '../utilities/usePriceFormatter'
import { useFilter } from './useFilter'

interface Props {
  /**
   * The array that represents the details of every facet.
   */
  facets: any[]
  /**
   * ID to find this component in testing tools (e.g.: cypress,
   * testing-library, and jest).
   */
  testId?: string
  /**
   * Title for the `FilterFixed` component.
   */
  title?: string
}

function FilterFixedUsage({
  facets,
  testId,
  dispatch,
  expanded,
  title,
}: Props & ReturnType<typeof useFilter>) {
  const { state, setState } = useSearch()

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
                      dispatch({ type: 'toggleFacet', payload: facet })
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
                }}
              />
            )}
          </UIFacets>
        )
      })}
    </UIFilter>
  )
}

export default FilterFixedUsage
