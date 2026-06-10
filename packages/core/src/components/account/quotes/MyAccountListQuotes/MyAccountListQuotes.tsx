import { Button, EmptyState, Icon as UIIcon, useUI } from '@faststore/ui'

import type { ServerListQuotesQueryQuery } from '@generated/graphql'

import AccountHeader from '../../components/MyAccountHeader'
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
import MyAccountQuotesSelectedTags from './MyAccountQuotesSelectedTags/MyAccountQuotesSelectedTags'
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
    Boolean(filters.expiresAtTo)
  )
}

export default function MyAccountListQuotes({
  listQuotes,
  total,
  perPage,
  filters,
}: MyAccountListQuotesProps) {
  const { isDesktop } = useScreenResize()

  const selectedFacets: SelectedFacet[] = getSelectedFacets({ filters })
  const allFacets = getAllFacets({ filters })

  const filter = useMyAccountFilter({ allFacets, selectedFacets })
  const { openFilter, filter: displayFilter } = useUI()

  const hasFilters = hasActiveFilters(filters)
  const isEmpty = listQuotes.list.length === 0

  return (
    <div className={styles.page}>
      <AccountHeader pageTitle="Quotes" />
      <div data-fs-list-orders-controls>
        <div data-fs-list-orders-search-filters>
          {isDesktop && (
            <Pagination page={filters.page} total={total} perPage={perPage} />
          )}
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
          </Button>
        </div>
      </div>

      <MyAccountQuotesSelectedTags
        filters={{
          status: filters.status,
          createdAtFrom: filters.createdAtFrom,
          createdAtTo: filters.createdAtTo,
          expiresAtFrom: filters.expiresAtFrom,
          expiresAtTo: filters.expiresAtTo,
        }}
        onClearAll={() => {
          window.location.href = '/pvt/account/quotes'
        }}
        onRemoveFilter={(key, value) => {
          const updatedFilters = { ...filters }

          if (key === 'status' && Array.isArray(updatedFilters.status)) {
            updatedFilters.status = updatedFilters.status.filter(
              (v) => v.toLowerCase() !== value.toLowerCase()
            )
          } else if (key === 'createdAtFrom' || key === 'createdAtTo') {
            updatedFilters.createdAtFrom = ''
            updatedFilters.createdAtTo = ''
          } else if (key === 'expiresAtFrom' || key === 'expiresAtTo') {
            updatedFilters.expiresAtFrom = ''
            updatedFilters.expiresAtTo = ''
          }

          const { page: _, ...filterParams } = updatedFilters
          const filteredQuery = Object.fromEntries(
            Object.entries(filterParams).filter(([, v]) =>
              Array.isArray(v) ? v.length > 0 : Boolean(v)
            )
          )

          const params = new URLSearchParams()
          Object.entries(filteredQuery).forEach(([k, v]) => {
            if (Array.isArray(v)) {
              v.forEach((item) => params.append(k, item))
            } else {
              params.set(k, v as string)
            }
          })

          window.location.href = `/pvt/account/quotes${params.toString() ? `?${params}` : ''}`
        }}
      />

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
