import dynamic from 'next/dynamic'

import { useSearch } from '@faststore/sdk'
import { useFormattedPrice } from 'src/sdk/product/useFormattedPrice'

import type {
  FilterFacetBooleanItemProps as UIFilterFacetBooleanItemProps,
  FilterFacetRangeProps as UIFilterFacetRangeProps,
  FilterFacetsProps as UIFilterFacetsProps,
  FilterProps as UIFilterProps,
  FilterSliderProps as UIFilterSliderProps,
} from '@faststore/ui'

const UIFilter = dynamic<{ children: React.ReactNode } & UIFilterProps>(() =>
  /* webpackChunkName: "UIFilter" */
  import('@faststore/ui').then((mod) => mod.Filter)
)
const UIFilterFacetBoolean = dynamic<{ children: React.ReactNode }>(() =>
  /* webpackChunkName: "UIFilterFacetBoolean" */
  import('@faststore/ui').then((mod) => mod.FilterFacetBoolean)
)
const UIFilterFacetBooleanItem = dynamic<UIFilterFacetBooleanItemProps>(() =>
  /* webpackChunkName: "UIFilterFacetBooleanItem" */
  import('@faststore/ui').then((mod) => mod.FilterFacetBooleanItem)
)
const UIFilterFacetRange = dynamic<UIFilterFacetRangeProps>(() =>
  /* webpackChunkName: "UIFilterFacetRange" */
  import('@faststore/ui').then((mod) => mod.FilterFacetRange)
)
const UIFilterFacets = dynamic<
  { children: React.ReactNode } & UIFilterFacetsProps
>(() =>
  /* webpackChunkName: "UIFilterFacets" */
  import('@faststore/ui').then((mod) => mod.FilterFacets)
)
const UIFilterSlider = dynamic<UIFilterSliderProps>(() =>
  /* webpackChunkName: "UIFilterSlider" */
  import('@faststore/ui').then((mod) => mod.FilterSlider)
)

import type { Filter_FacetsFragment } from '@generated/graphql'

import type { useFilter } from 'src/sdk/search/useFilter'

import styles from './section.module.scss'

export interface FilterSliderProps {
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
  /**
   * CMS defined label for the clear button component.
   */
  clearButtonLabel?: string
  /**
   * CMS defined label for the apply button component.
   */
  applyButtonLabel?: string
}

function FilterSlider({
  facets,
  testId,
  dispatch,
  expanded,
  selected,
  title,
  clearButtonLabel,
  applyButtonLabel,
}: FilterSliderProps & ReturnType<typeof useFilter>) {
  const { resetInfiniteScroll, setState, state } = useSearch()

  return (
    <UIFilterSlider
      overlayProps={{
        className: `section ${styles.section} section-filter-slider`,
      }}
      title={title}
      size="partial"
      direction="rightSide"
      clearBtnProps={{
        variant: 'secondary',
        onClick: () => dispatch({ type: 'selectFacets', payload: [] }),
        children: clearButtonLabel ?? 'Clear All',
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
        children: applyButtonLabel ?? 'Apply',
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
        onAccordionChange={(index: number) =>
          dispatch({ type: 'toggleExpanded', payload: index })
        }
      >
        {facets.map((facet, index) => {
          const { __typename: type, label } = facet
          const isExpanded = expanded.has(index)
          return (
            <UIFilterFacets
              key={`${testId}-${label}-${index}`}
              testId={`mobile-${testId}`}
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
                      testId={`mobile-${testId}`}
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
                  formatter={
                    facet.key.toLowerCase() === 'price'
                      ? useFormattedPrice
                      : undefined
                  }
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
