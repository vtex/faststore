import {
  Filter as UIFilter,
  FilterFacetBoolean as UIFilterFacetBoolean,
  FilterFacetBooleanItem as UIFilterFacetBooleanItem,
  FilterFacets as UIFilterFacets,
  FilterSlider as UIFilterSlider,
} from '@faststore/ui'

import { useRef, useState } from 'react'
import MyAccountFilterFacetDateRange from 'src/components/account/orders/MyAccountListOrders/MyAccountFilterSlider/MyAccountFilterFacetDateRange/MyAccountFilterFacetDateRange'
import type {
  MyAccountFilter_FacetsFragment,
  useMyAccountFilter,
} from 'src/sdk/search/useMyAccountFilter'
import styles from './section.module.scss'

export interface MyAccountQuotesFilterSliderProps {
  testId?: string
  facets: MyAccountFilter_FacetsFragment[]
  title?: string
  clearButtonLabel?: string
  applyButtonLabel?: string
}

function MyAccountQuotesFilterSlider({
  facets,
  testId,
  dispatch,
  expanded,
  selected,
  title,
  clearButtonLabel,
  applyButtonLabel,
}: MyAccountQuotesFilterSliderProps & ReturnType<typeof useMyAccountFilter>) {
  const createdDateRangeRef = useRef<{
    clear: () => void
    getDataRangeFacet: () => {
      key: string
      value: { from: string; to: string }
    }
  }>(null)

  const expiresDateRangeRef = useRef<{
    clear: () => void
    getDataRangeFacet: () => {
      key: string
      value: { from: string; to: string }
    }
  }>(null)

  const [disabled, setDisabled] = useState(false)

  const handleApply = () => {
    const createdRange = createdDateRangeRef.current?.getDataRangeFacet()?.value
    const expiresRange = expiresDateRangeRef.current?.getDataRangeFacet()?.value

    const params = new URLSearchParams()

    const statusFacets = selected.filter((f) => f.key === 'status')
    statusFacets.forEach((f) => params.append('status', f.value))

    if (createdRange?.from?.trim()) {
      params.set('createdAtFrom', createdRange.from.trim())
    }
    if (createdRange?.to?.trim()) {
      params.set('createdAtTo', createdRange.to.trim())
    }
    if (expiresRange?.from?.trim()) {
      params.set('expiresAtFrom', expiresRange.from.trim())
    }
    if (expiresRange?.to?.trim()) {
      params.set('expiresAtTo', expiresRange.to.trim())
    }

    window.location.href = `/pvt/account/quotes${params.toString() ? `?${params}` : ''}`
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
          createdDateRangeRef.current?.clear()
          expiresDateRangeRef.current?.clear()
          dispatch({ type: 'selectFacets', payload: [] })
        },
        children: clearButtonLabel ?? 'Clear All',
      }}
      applyBtnProps={{
        variant: 'primary',
        onClick: handleApply,
        disabled,
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
              {type === 'StoreFacetRange' &&
                isExpanded &&
                facet.key === 'createdAt' && (
                  <MyAccountFilterFacetDateRange
                    ref={createdDateRangeRef}
                    from={facet.from}
                    to={facet.to}
                    setDisabled={setDisabled}
                  />
                )}
              {type === 'StoreFacetRange' &&
                isExpanded &&
                facet.key === 'expiresAt' && (
                  <MyAccountFilterFacetDateRange
                    ref={expiresDateRangeRef}
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

export default MyAccountQuotesFilterSlider
