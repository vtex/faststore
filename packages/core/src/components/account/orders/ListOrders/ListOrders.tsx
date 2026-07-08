import { useRef, type MutableRefObject } from 'react'

import type { ServerListOrdersQueryQuery } from '@generated/graphql'
import { useRouter } from 'next/router'

import {
  Button,
  EmptyState,
  LinkButton,
  SearchInputField,
  Icon as UIIcon,
  useUI,
  type SearchInputFieldRef,
} from '@faststore/ui'
import { useEffect } from 'react'
import FilterSlider from 'src/components/account/orders/ListOrders/FilterSlider'
import { useDebounce } from 'src/sdk/account/useDebounce'
import {
  useMyAccountFilter,
  type MyAccountFilter_FacetsFragment,
  type SelectedFacet,
} from 'src/sdk/search/useMyAccountFilter'
import { useLink } from 'src/sdk/ui/useLink'
import useScreenResize from 'src/sdk/ui/useScreenResize'
import { FastStoreOrderStatus } from 'src/utils/userOrderStatus'
import AccountHeader from '../../components/Header'
import {
  type ListOrdersSectionLabels,
  getStatusFacetLabels,
  resolveListOrdersLabels,
} from './listOrdersLabels'
import ListOrdersTable, { Pagination } from './ListOrdersTable/ListOrdersTable'
import SelectedFiltersTags from './SelectedTags/SelectedTags'
import styles from './styles.module.scss'

const ORDERS_PATH = '/pvt/account/orders'

export type ListOrdersProps = {
  listOrders: ServerListOrdersQueryQuery['listUserOrders']
  total: number
  perPage: number
  filters: {
    page: number
    status: string[]
    dateInitial: string
    dateFinal: string
    text: string
    clientEmail: string
    pendingMyApproval?: boolean
  }
  labels?: ListOrdersSectionLabels
}

function getSelectedFacets({
  filters,
}: {
  filters: ListOrdersProps['filters']
}): SelectedFacet[] {
  return Object.keys(filters).reduce((acc, filter) => {
    // FilterSlider does not deal with these filters
    if (filter === 'page' || filter === 'text' || filter === 'clientEmail') {
      return acc
    }

    const value = filters[filter as keyof typeof filters] as string | string[]

    if (filter === 'status' && value.length > 0) {
      const status = Array.isArray(value) ? value : [value]
      acc.push(
        ...status.map((statusValue) => ({
          key: 'status',
          value: statusValue.toLowerCase(),
        }))
      )
    } else if (filter === 'dateInitial' && value) {
      acc.push({
        key: 'dateInitial',
        value: String(value),
      })
    } else if (filter === 'dateFinal' && value) {
      acc.push({
        key: 'dateFinal',
        value: String(value),
      })
    } else if (filter === 'pendingMyApproval' && value) {
      acc.push({
        key: 'pendingMyApproval',
        value: String(value),
      })
    }

    return acc
  }, [] as SelectedFacet[])
}

function getAllFacets({
  filters,
  labels,
}: {
  filters: ListOrdersProps['filters']
  labels: ReturnType<typeof resolveListOrdersLabels>
}): MyAccountFilter_FacetsFragment[] {
  const statusFacetLabels = getStatusFacetLabels(labels)

  return [
    {
      __typename: 'StoreFacetPendingApproval',
      key: 'pendingMyApproval',
      label: labels.pendingApprovalLabel,
    } as any,
    {
      __typename: 'StoreFacetBoolean',
      key: 'status',
      label: 'Status',
      values: FastStoreOrderStatus.map((status, index) => ({
        label: statusFacetLabels[index] ?? status,
        quantity: 0,
        selected: false,
        value: status.toLowerCase(),
      })),
    },
    {
      __typename: 'StoreFacetRange',
      key: 'dateRange',
      label: 'Order Date',
      from: filters.dateInitial,
      to: filters.dateFinal,
    },
  ]
}

function hasActiveFilters(filters: ListOrdersProps['filters']): boolean {
  return (
    filters.status.length > 0 ||
    Boolean(filters.dateInitial) ||
    Boolean(filters.dateFinal) ||
    Boolean(filters.text) ||
    Boolean(filters.pendingMyApproval)
  )
}

export default function ListOrders({
  listOrders,
  total,
  perPage,
  filters,
  labels: labelsProp,
}: ListOrdersProps) {
  const labels = resolveListOrdersLabels(labelsProp)
  const router = useRouter()
  const { resolveLink } = useLink()
  const ordersHref = resolveLink(ORDERS_PATH) ?? ORDERS_PATH
  const { isDesktop } = useScreenResize()
  const searchInputRef = useRef(null) as MutableRefObject<SearchInputFieldRef>

  // Set the initial value of the search input field based on server values
  useEffect(() => {
    if (!searchInputRef.current?.inputRef) return

    if (filters?.text && searchInputRef.current?.inputRef) {
      searchInputRef.current.inputRef.value = filters.text
    } else {
      searchInputRef.current.inputRef.value = ''
    }
  }, [filters?.text])

  // Debounce the search input value to avoid too many requests
  const handleSearchChange = useDebounce(
    (value: string) => {
      if (!value && !router.query.text) {
        return
      }

      const searchInputValueChanged =
        value.trim().toLowerCase() !==
        router.query.text?.toString().trim().toLowerCase()

      if (searchInputValueChanged) {
        const params = new URLSearchParams(window.location.search)
        params.delete('text')
        params.delete('page')

        if (value) {
          params.set('text', value)
        }

        window.location.href = `${ordersHref}?${params.toString()}`
      }
    },
    300,
    String(router.query.text)
  )

  const selectedFacets: SelectedFacet[] = getSelectedFacets({ filters })
  const allFacets = getAllFacets({ filters, labels })

  const filter = useMyAccountFilter({
    allFacets,
    selectedFacets,
  })

  const { openFilter, filter: displayFilter } = useUI()

  const hasFilters = hasActiveFilters(filters)
  const isEmpty = listOrders.list.length === 0

  return (
    <div className={styles.page}>
      <AccountHeader pageTitle={labels.pageTitle} />
      <div data-fs-list-orders-controls>
        <div data-fs-list-orders-search-filters>
          <SearchInputField
            ref={searchInputRef}
            data-fs-search-input-field-list-orders
            placeholder={labels.searchPlaceholder}
            onBlur={(_) => {
              handleSearchChange(searchInputRef.current.inputRef.value)
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSearchChange(searchInputRef.current.inputRef.value)
              }
            }}
            onSubmit={(_) => {
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
            {labels.filtersLabel}
          </Button>
        </div>
        {isDesktop && (
          <Pagination
            page={filters.page}
            total={total}
            perPage={perPage}
            labels={labels}
          />
        )}
      </div>

      <SelectedFiltersTags
        labels={labels}
        filters={{
          status: filters.status,
          dateInitial: filters.dateInitial,
          dateFinal: filters.dateFinal,
          pendingMyApproval: filters.pendingMyApproval,
        }}
        onClearAll={() => {
          window.location.href = ordersHref
        }}
        onRemoveFilter={(key, value) => {
          const { page, clientEmail, ...updatedFilters } = { ...filters }

          if (key === 'status' && Array.isArray(updatedFilters[key])) {
            updatedFilters[key] = updatedFilters[key].filter(
              (v) => v.toLowerCase() !== value.toString().toLowerCase()
            )
          } else if (key === 'dateInitial' || key === 'dateFinal') {
            delete updatedFilters.dateInitial
            delete updatedFilters.dateFinal
          } else {
            delete updatedFilters[key]
          }

          // Remove filters with no values
          const filteredQuery = Object.fromEntries(
            Object.entries(updatedFilters).filter(([, v]) =>
              Array.isArray(v) ? v.length > 0 : Boolean(v)
            )
          )

          const params = new URLSearchParams(
            filteredQuery as Record<string, string>
          )
          window.location.href = `${ordersHref}?${params.toString()}`
        }}
      />

      {displayFilter && (
        <FilterSlider
          {...filter}
          title={labels.filtersLabel}
          clearButtonLabel={labels.clearAllLabel}
          applyButtonLabel={labels.viewResultsLabel}
          fromLabel={labels.fromLabel}
          toLabel={labels.toLabel}
          invalidDateRangeLabel={labels.invalidDateRangeLabel}
          searchInputRef={searchInputRef}
          testId="my-account-filter-slider"
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
          title={hasFilters ? labels.noResultsLabel : labels.noOrdersLabel}
          bkgColor="light"
        >
          {!hasFilters && (
            <LinkButton
              data-fs-list-orders-empty-state-link
              href="/"
              variant="secondary"
            >
              {labels.startShoppingLabel}
            </LinkButton>
          )}
        </EmptyState>
      ) : (
        <ListOrdersTable
          listOrders={listOrders}
          total={total}
          perPage={perPage}
          filters={filters}
          labels={labels}
        />
      )}
      {!isDesktop && (
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
