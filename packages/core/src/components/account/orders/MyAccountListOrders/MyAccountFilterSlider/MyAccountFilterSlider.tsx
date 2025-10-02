import {
  type SearchInputFieldRef,
  Filter as UIFilter,
  FilterFacetBoolean as UIFilterFacetBoolean,
  FilterFacetBooleanItem as UIFilterFacetBooleanItem,
  FilterFacets as UIFilterFacets,
  FilterSlider as UIFilterSlider,
} from '@faststore/ui'

import { type MutableRefObject, useRef, useState } from 'react'
import type {
  MyAccountFilter_FacetsFragment,
  useMyAccountFilter,
} from 'src/sdk/search/useMyAccountFilter'
import FilterFacetDateRange from './MyAccountFilterFacetDateRange'
import FilterFacetPlacedBy from './MyAccountFilterFacetPlacedBy'
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
  facets: MyAccountFilter_FacetsFragment[]
  /**
   * Title for the `Filter` component.
   */
  title?: string
  /**
   * Defined label for the clear button component.
   */
  clearButtonLabel?: string
  /**
   * Defined label for the apply button component.
   */
  applyButtonLabel?: string
  /**
   * Ref to the search input field.
   */
  searchInputRef?: MutableRefObject<SearchInputFieldRef>
}

function MyAccountFilterSlider({
  facets,
  testId,
  dispatch,
  expanded,
  selected,
  title,
  clearButtonLabel,
  applyButtonLabel,
  searchInputRef,
}: FilterSliderProps & ReturnType<typeof useMyAccountFilter>) {
  const dateRangeInputRef = useRef<{
    clear: () => void
    getDataRangeFacet: () => {
      key: string
      value: { from: string; to: string }
    }
  }>(null)

  const [disabled, setDisabled] = useState(false)

  const handleFilterChange = ({
    selectedFacets,
    text,
  }: {
    selectedFacets: {
      key: string
      value: string
    }[]
    text: string
  }) => {
    const facets = selectedFacets.reduce(
      (acc, facet) => {
        const { key, value } = facet
        if (key === 'dateInitial') {
          acc['dateInitial'] = value
        }

        if (key === 'dateFinal') {
          acc['dateFinal'] = value
        }

        if (key === 'status') {
          acc['status'] = Array.isArray(acc['status'])
            ? [...acc['status'], value]
            : [value]
        }

        if (key === 'purchaseAgentId') {
          acc['purchaseAgentId'] = value
        }

        return acc
      },
      {} as Record<string, string | string[]>
    )

    const params = new URLSearchParams()

    if (text) {
      params.set('text', text)
    }

    Object.entries(facets).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach((v) => params.append(key, v))
      } else {
        params.set(key, value)
      }
    })

    window.location.href = `/pvt/account/orders?${params.toString()}`
  }

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
        onClick: () => {
          dateRangeInputRef.current?.clear()
          dispatch({ type: 'selectFacets', payload: [] })
        },
        children: clearButtonLabel ?? 'Clear All',
      }}
      applyBtnProps={{
        variant: 'primary',
        onClick: () => {
          const dateRangeFacet =
            dateRangeInputRef.current?.getDataRangeFacet?.()
          const dateFrom = dateRangeFacet?.value?.from?.trim?.()
          const dateTo = dateRangeFacet?.value?.to?.trim?.()

          const dateFacets = []
          if (dateFrom) {
            dateFacets.push({ key: 'dateInitial', value: dateFrom })
          }
          if (dateTo) {
            dateFacets.push({ key: 'dateFinal', value: dateTo })
          }

          const selectedFacets = [...selected, ...dateFacets]

          handleFilterChange({
            selectedFacets,
            text: searchInputRef.current?.inputRef.value,
          })
        },
        disabled: disabled,
        children: applyButtonLabel ?? 'Apply',
      }}
      onClose={() => {}}
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
                  {facet.values.map((item) => {
                    const normalizedTestId = testId?.trim().toLowerCase() || ''
                    const normalizedFacetLabel =
                      facet.label?.trim().toLowerCase() || ''
                    const normalizedItemLabel =
                      item.label?.trim().toLowerCase() || ''
                    const itemId = `${normalizedTestId}-${normalizedFacetLabel}-${normalizedItemLabel}`

                    return (
                      <UIFilterFacetBooleanItem
                        key={itemId}
                        id={itemId}
                        testId={`mobile-${normalizedTestId}`}
                        onFacetChange={(facet) =>
                          dispatch({ type: 'toggleFacet', payload: facet })
                        }
                        selected={item.selected}
                        value={item.value}
                        quantity={item.quantity}
                        facetKey={facet.key}
                        label={item.label}
                      />
                    )
                  })}
                </UIFilterFacetBoolean>
              )}
              {type === 'StoreFacetPlacedBy' && isExpanded && (
                <FilterFacetPlacedBy selected={selected} dispatch={dispatch} />
              )}
              {type === 'StoreFacetRange' && isExpanded && (
                <FilterFacetDateRange
                  ref={dateRangeInputRef}
                  from={facet.from}
                  to={facet.to}
                  setDisabled={setDisabled}
                />
              )}
            </UIFilterFacets>
          )
        })}
      </UIFilter>
    </UIFilterSlider>
  )
}

export default MyAccountFilterSlider
