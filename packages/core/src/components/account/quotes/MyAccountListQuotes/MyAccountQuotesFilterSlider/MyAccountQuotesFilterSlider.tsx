import { FilterSlider as UIFilterSlider } from '@faststore/ui'

import { useRef, useState } from 'react'
import MyAccountFilterFacetDateRange from 'src/components/account/orders/MyAccountListOrders/MyAccountFilterSlider/MyAccountFilterFacetDateRange/MyAccountFilterFacetDateRange'
import type {
  MyAccountFilter_FacetsFragment,
  useMyAccountFilter,
} from 'src/sdk/search/useMyAccountFilter'
import MyAccountQuotesStatusSelector from '../MyAccountQuotesStatusSelector/MyAccountQuotesStatusSelector'
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

  const statusFacet = facets.find(
    (f) => f.__typename === 'StoreFacetBoolean' && f.key === 'status'
  )
  const rangeFacets = facets.filter((f) => f.__typename === 'StoreFacetRange')
  const selectedStatusValues = selected
    .filter((f) => f.key === 'status')
    .map((f) => f.value)

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
      {statusFacet && (
        <MyAccountQuotesStatusSelector
          value={selectedStatusValues}
          onChange={(newSelected) => {
            const added = newSelected.filter(
              (v) => !selectedStatusValues.includes(v)
            )
            const removed = selectedStatusValues.filter(
              (v) => !newSelected.includes(v)
            )
            ;[...added, ...removed].forEach((v) =>
              dispatch({
                type: 'toggleFacet',
                payload: { key: 'status', value: v },
              })
            )
          }}
        />
      )}
      {rangeFacets.map((facet, index) => (
        <div
          key={`${testId}-${facet.label}-${index}`}
          data-fs-quotes-filter-group
        >
          <p data-fs-quotes-filter-group-label>{facet.label}</p>
          {facet.key === 'createdAt' && (
            <MyAccountFilterFacetDateRange
              ref={createdDateRangeRef}
              from={facet.from}
              to={facet.to}
              setDisabled={setDisabled}
            />
          )}
          {facet.key === 'expiresAt' && (
            <MyAccountFilterFacetDateRange
              ref={expiresDateRangeRef}
              from={facet.from}
              to={facet.to}
              setDisabled={setDisabled}
            />
          )}
        </div>
      ))}
    </UIFilterSlider>
  )
}

export default MyAccountQuotesFilterSlider
