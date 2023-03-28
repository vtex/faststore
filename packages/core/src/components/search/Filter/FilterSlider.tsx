import { useSearch } from '@faststore/sdk'
import {
  FacetBoolean as UIFacetBoolean,
  FacetBooleanItem as UIFacetBooleanItem,
  FacetRange as UIFacetRange,
  Facets as UIFacets,
  Filter as UIFilter,
  FilterSlider as UIFilterSlider,
} from '@faststore/ui'
import { useFormattedPrice } from 'src/sdk/product/useFormattedPrice'

import type { Filter_FacetsFragment } from '@generated/graphql'

import type { useFilter } from './useFilter'

interface Props {
  /**
   * ID to find this component in testing tools (e.g.: cypress,
   * testing-library, and jest).
   */
  testId?: string
  /**
   * The array that represents the details of every facet.
   */
  facets: Filter_FacetsFragment[]
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
                </UIFacetBoolean>
              )}
              {type === 'StoreFacetRange' && isExpanded && (
                <UIFacetRange
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
            </UIFacets>
          )
        })}
      </UIFilter>
    </UIFilterSlider>
  )
}

export default FilterSlider
