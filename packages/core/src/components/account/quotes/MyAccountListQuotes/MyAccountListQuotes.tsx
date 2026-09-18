import {
  Button,
  EmptyState,
  Icon as UIIcon,
  SearchInputField,
  useUI,
  type SearchInputFieldRef,
} from '@faststore/ui'
import { useRef, useEffect, type MutableRefObject } from 'react'

import type { ServerListQuotesQueryQuery } from '@generated/graphql'

import AccountHeader from '../../components/Header'
import { useDebounce } from 'src/sdk/account/useDebounce'
import { useMyAccountFilter } from 'src/sdk/search/useMyAccountFilter'
import useScreenResize from 'src/sdk/ui/useScreenResize'
import MyAccountListQuotesTable, {
  Pagination,
} from './MyAccountListQuotesTable/MyAccountListQuotesTable'
import MyAccountQuotesFilterSlider from './MyAccountQuotesFilterSlider/MyAccountQuotesFilterSlider'
import {
  getSelectedFacets,
  getAllFacets,
  hasActiveFilters,
  countActiveFilters,
} from './quoteFilters'
import type { MyAccountListQuotesSectionLabels } from './quotesLabels'
import {
  pickQuoteStatusCmsLabels,
  resolveMyAccountListQuotesLabels,
} from './quotesLabels'
import styles from './styles.module.scss'

export type MyAccountListQuotesProps = Readonly<{
  listQuotes: ServerListQuotesQueryQuery['listUserQuotes']
  total: number
  perPage: number
  filters: {
    page: number
    status: string[]
    createdAtFrom: string
    createdAtTo: string
    expiresAtFrom: string
    expiresAtTo: string
    label: string
  }
  labels?: MyAccountListQuotesSectionLabels
}>

export default function MyAccountListQuotes({
  listQuotes,
  total,
  perPage,
  filters,
  labels: labelsProp,
}: MyAccountListQuotesProps) {
  const labels = resolveMyAccountListQuotesLabels(labelsProp)
  const statusCmsLabels = pickQuoteStatusCmsLabels(labels)
  const { isDesktop } = useScreenResize()
  const searchInputRef = useRef(null) as MutableRefObject<SearchInputFieldRef>

  useEffect(() => {
    if (!searchInputRef.current?.inputRef) return
    searchInputRef.current.inputRef.value = filters.label ?? ''
  }, [filters.label])

  const handleSearchChange = useDebounce(
    (value: string) => {
      const params = new URLSearchParams(globalThis.location.search)
      params.delete('label')
      params.delete('page')
      if (value) params.set('label', value)
      globalThis.location.href = `/pvt/account/quotes?${params.toString()}`
    },
    300,
    filters.label
  )

  const selectedFacets = getSelectedFacets(filters)
  const allFacets = getAllFacets(filters, {
    statusFacetLabel: labels.statusFacetLabel,
    createdAtFacetLabel: labels.createdAtFacetLabel,
    expiresAtFacetLabel: labels.expiresAtFacetLabel,
    statusCmsLabels,
  })

  const filter = useMyAccountFilter({ allFacets, selectedFacets })
  const { openFilter, filter: displayFilter } = useUI()

  const hasFilters = hasActiveFilters(filters)
  const activeFilterCount = countActiveFilters(filters)
  const isEmpty = (listQuotes?.list.length ?? 0) === 0

  return (
    <div className={styles.page}>
      <AccountHeader pageTitle={labels.pageTitle} />
      <div data-fs-list-quotes-controls>
        <div data-fs-list-quotes-search-filters>
          <SearchInputField
            ref={searchInputRef}
            data-fs-search-input-field-list-quotes
            placeholder={labels.searchPlaceholder}
            onBlur={() => {
              handleSearchChange(searchInputRef.current.inputRef.value)
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSearchChange(searchInputRef.current.inputRef.value)
              }
            }}
            onSubmit={() => {
              handleSearchChange(searchInputRef.current.inputRef.value)
            }}
          />
          <Button
            data-fs-list-quotes-search-filters-button
            size="small"
            variant="tertiary"
            icon={
              <UIIcon
                name="FadersHorizontal"
                width={24}
                height={24}
                aria-label={labels.openFiltersAriaLabel}
              />
            }
            iconPosition="left"
            onClick={() => {
              filter.dispatch({
                type: 'selectFacets',
                payload: getSelectedFacets(filters),
              })
              openFilter()
            }}
          >
            {labels.filtersLabel}
            {activeFilterCount > 0 && (
              <span data-fs-filter-count>{activeFilterCount}</span>
            )}
          </Button>
        </div>
        {isDesktop && total > 0 && (
          <Pagination
            page={filters.page}
            total={total}
            perPage={perPage}
            labels={labels}
          />
        )}
      </div>

      {displayFilter && (
        <MyAccountQuotesFilterSlider
          {...filter}
          title={labels.filtersLabel}
          clearButtonLabel={labels.clearAllLabel}
          applyButtonLabel={labels.viewResultsLabel}
          statusLabel={labels.statusFacetLabel}
          removeStatusAriaLabel={labels.removeStatusAriaLabel}
          fromLabel={labels.fromLabel}
          toLabel={labels.toLabel}
          invalidDateRangeLabel={labels.invalidDateRangeLabel}
          statusCmsLabels={statusCmsLabels}
          testId="my-account-quotes-filter-slider"
        />
      )}

      {isEmpty ? (
        <EmptyState
          titleIcon={
            <UIIcon
              name={hasFilters ? 'MagnifyingGlass' : 'Bag2'}
              width={56}
              height={56}
              weight="thin"
            />
          }
          title={hasFilters ? labels.noResultsLabel : labels.noQuotesLabel}
          bkgColor="light"
        />
      ) : (
        <MyAccountListQuotesTable
          listQuotes={listQuotes}
          total={total}
          perPage={perPage}
          filters={filters}
          labels={labels}
        />
      )}

      {!isDesktop && total > 0 && (
        <Pagination
          page={filters.page}
          total={total}
          perPage={perPage}
          labels={labels}
        />
      )}
    </div>
  )
}
