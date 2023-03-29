import { useSearch } from '@faststore/sdk'
import { Filter as UIFilter, FilterFacetBoolean as UIFilterFacetBoolean, FilterFacetBooleanItem as UIFilterFacetBooleanItem, FilterFacetRange as UIFilterFacetRange, FilterFacets as UIFilterFacets, FilterSlider as UIFilterSlider } from '@faststore/ui'
import { useFormattedPrice } from '../utilities/usePriceFormatter'
import type { FilterFacet } from './FilterUsage'

import type { useFilter } from './useFilter'

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
   * Title for the `Filter` component.
   */
  title?: string
}

function FilterSlider({
  facets,
  testId,
  dispatch,
  expanded,
  selected,
  title,
}: Props & ReturnType<typeof useFilter>) {
  const { resetInfiniteScroll, setState, state } = useSearch()

  return (
    <UIFilterSlider
      title={title}
      size="partial"
      direction="rightSide"
      clearBtnProps={{
        variant: 'secondary',
        onClick: () => dispatch({ type: 'selectFacets', payload: [] }),
        children: 'Clear All',
      }}
      applyBtnProps={{
        variant: 'primary',
        onClick: () => {
          resetInfiniteScroll(0)

          setState({
            ...state,
            selectedFacets: selected,
            page: 0,
          })
        },
        children: 'Apply',
      }}
      onClose={() => {
        dispatch({
          type: 'selectFacets',
          payload: state.selectedFacets,
        })
      }}
    >
      <UIFilter
        testId={`mobile-${testId}`}
        indicesExpanded={expanded}
        onAccordionChange={(index) =>
          dispatch({ type: 'toggleExpanded', payload: index })
        }
      >
        {facets.map((facet, index) => {
          const { __typename: type, label } = facet
          const isExpanded = expanded.has(index)
          return (
            <UIFilterFacets
              key={`${testId}-${label}-${index}`}
              testId={testId}
              index={index}
              type={type}
              label={label}
            >
              {type === 'StoreFacetBoolean' && isExpanded && (
                <UIFilterFacetBoolean>
                  {facet.values.map((item) => (
                    <UIFilterFacetBooleanItem
                      key={`${testId}-${facet.label}-${item.label}`}
                      id={`${testId}-${facet.label}-${item.label}`}
                      testId={testId}
                      onFacetChange={(facet) =>
                        dispatch({ type: 'toggleFacet', payload: facet })
                      }
                      selected={item.selected}
                      value={item.value}
                      quantity={item.quantity}
                      facetKey={facet.key}
                      label={item.label}
                    />
                  ))}
                </UIFilterFacetBoolean>
              )}
              {type === 'StoreFacetRange' && isExpanded && (
                <UIFilterFacetRange
                  facetKey={facet.key}
                  min={facet.min}
                  max={facet.max}
                  formatter={useFormattedPrice}
                  onFacetChange={(facet) =>
                    dispatch({
                      type: 'setFacet',
                      payload: { facet, unique: true },
                    })
                  }
                />
              )}
            </UIFilterFacets>
          )
        })}
      </UIFilter>
    </UIFilterSlider>
  )
}

export default FilterSlider
