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

import AccountHeader from '../../components/MyAccountHeader'
import { useDebounce } from 'src/sdk/account/useDebounce'
import {
  useMyAccountFilter,
  type MyAccountFilter_FacetsFragment,
  type SelectedFacet,
} from 'src/sdk/search/useMyAccountFilter'
import useScreenResize from 'src/sdk/ui/useScreenResize'
import { quoteStatusMap } from 'src/utils/quoteStatus'
import MyAccountListQuotesTable, {
  Pagination,
} from './MyAccountListQuotesTable/MyAccountListQuotesTable'
import MyAccountQuotesFilterSlider from './MyAccountQuotesFilterSlider/MyAccountQuotesFilterSlider'
import styles from './styles.module.scss'

export type MyAccountListQuotesProps = {
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
}

function getSelectedFacets({
  filters,
}: {
  filters: MyAccountListQuotesProps['filters']
}): SelectedFacet[] {
  const facets: SelectedFacet[] = []

  if (filters.status.length > 0) {
    filters.status.forEach((s) =>
      facets.push({ key: 'status', value: s.toLowerCase() })
    )
  }

  return facets
}

function getAllFacets({
  filters,
}: {
  filters: MyAccountListQuotesProps['filters']
}): MyAccountFilter_FacetsFragment[] {
  return [
    {
      __typename: 'StoreFacetBoolean',
      key: 'status',
      label: 'Status',
      values: Object.entries(quoteStatusMap).map(([key, { label }]) => ({
        label,
        quantity: 0,
        selected: false,
        value: key.toLowerCase(),
      })),
    },
    {
      __typename: 'StoreFacetRange',
      key: 'createdAt',
      label: 'Created Date',
      from: filters.createdAtFrom,
      to: filters.createdAtTo,
    },
    {
      __typename: 'StoreFacetRange',
      key: 'expiresAt',
      label: 'Expiry Date',
      from: filters.expiresAtFrom,
      to: filters.expiresAtTo,
    },
  ]
}

function hasActiveFilters(
  filters: MyAccountListQuotesProps['filters']
): boolean {
  return (
    filters.status.length > 0 ||
    Boolean(filters.createdAtFrom) ||
    Boolean(filters.createdAtTo) ||
    Boolean(filters.expiresAtFrom) ||
    Boolean(filters.expiresAtTo) ||
    Boolean(filters.label)
  )
}

function countActiveFilters(
  filters: MyAccountListQuotesProps['filters']
): number {
  let count = 0
  if (filters.status.length > 0) count++
  if (filters.createdAtFrom || filters.createdAtTo) count++
  if (filters.expiresAtFrom || filters.expiresAtTo) count++
  return count
}

export default function MyAccountListQuotes({
  listQuotes,
  total,
  perPage,
  filters,
}: MyAccountListQuotesProps) {
  const { isDesktop } = useScreenResize()
  const searchInputRef = useRef(null) as MutableRefObject<SearchInputFieldRef>

  useEffect(() => {
    if (!searchInputRef.current?.inputRef) return
    searchInputRef.current.inputRef.value = filters.label ?? ''
  }, [filters.label])

  const handleSearchChange = useDebounce(
    (value: string) => {
      const params = new URLSearchParams(window.location.search)
      params.delete('label')
      params.delete('page')
      if (value) params.set('label', value)
      window.location.href = `/pvt/account/quotes?${params.toString()}`
    },
    300,
    filters.label
  )

  const selectedFacets: SelectedFacet[] = getSelectedFacets({ filters })
  const allFacets = getAllFacets({ filters })

  const filter = useMyAccountFilter({ allFacets, selectedFacets })
  const { openFilter, filter: displayFilter } = useUI()

  const hasFilters = hasActiveFilters(filters)
  const activeFilterCount = countActiveFilters(filters)
  const isEmpty = listQuotes.list.length === 0

  return (
    <div className={styles.page}>
      <AccountHeader pageTitle="Quotes" />
      <div data-fs-list-orders-controls>
        <div data-fs-list-orders-search-filters>
          <SearchInputField
            ref={searchInputRef}
            data-fs-search-input-field-list-orders
            placeholder="Search"
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
            data-fs-list-orders-search-filters-button
            size="small"
            variant="tertiary"
            icon={
              <UIIcon
                name="FadersHorizontal"
                width={24}
                height={24}
                aria-label="Open Filters"
              />
            }
            iconPosition="left"
            onClick={() => {
              filter.dispatch({
                type: 'selectFacets',
                payload: getSelectedFacets({ filters }),
              })
              openFilter()
            }}
          >
            Filters
            {activeFilterCount > 0 && (
              <span data-fs-filter-count>{activeFilterCount}</span>
            )}
          </Button>
        </div>
        {isDesktop && (
          <Pagination page={filters.page} total={total} perPage={perPage} />
        )}
      </div>

      {displayFilter && (
        <MyAccountQuotesFilterSlider
          {...filter}
          title="Filters"
          clearButtonLabel="Clear All"
          applyButtonLabel="View Results"
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
          title={hasFilters ? 'No results found' : "You don't have any quotes"}
          bkgColor="light"
        />
      ) : (
        <MyAccountListQuotesTable
          listQuotes={listQuotes}
          total={total}
          perPage={perPage}
          filters={filters}
        />
      )}

      {!isDesktop && (
        <Pagination page={filters.page} total={total} perPage={perPage} />
      )}
    </div>
  )
}
