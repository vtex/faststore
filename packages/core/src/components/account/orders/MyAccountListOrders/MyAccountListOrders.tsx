import { useRef, type MutableRefObject } from 'react'

import type { ServerListOrdersQueryQuery } from '@generated/graphql'
import { useRouter } from 'next/router'

import {
  Button,
  Icon,
  SearchInputField,
  useUI,
  type SearchInputFieldRef,
} from '@faststore/ui'
import { useEffect } from 'react'
import MyAccountFilterSlider from 'src/components/account/orders/MyAccountListOrders/MyAccountFilterSlider'
import { useDebounce } from 'src/sdk/account/useDebounce'
import {
  useMyAccountFilter,
  type MyAccountFilter_FacetsFragment,
  type SelectedFacet,
} from 'src/sdk/search/useMyAccountFilter'
import useScreenResize from 'src/sdk/ui/useScreenResize'
import { FastStoreOrderStatus } from 'src/utils/userOrderStatus'
import MyAccountListOrdersEmptyState from './MyAccountListOrdersEmptyState'
import MyAccountListOrdersTable, {
  Pagination,
} from './MyAccountListOrdersTable/MyAccountListOrdersTable'
import SelectedFiltersTags from './MyAccountSelectedTags/MyAccountSelectedTags'
import styles from './styles.module.scss'

export type MyAccountListOrdersProps = {
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
  }
}

function getSelectedFacets({
  filters,
}: {
  filters: MyAccountListOrdersProps['filters']
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
    }

    return acc
  }, [] as SelectedFacet[])
}

function getAllFacets({
  filters,
}: {
  filters: MyAccountListOrdersProps['filters']
}): MyAccountFilter_FacetsFragment[] {
  return [
    {
      __typename: 'StoreFacetBoolean',
      key: 'status',
      label: 'Status',
      values: FastStoreOrderStatus.map((status) => ({
        label: status,
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

export default function MyAccountListOrders({
  listOrders,
  total,
  perPage,
  filters,
}: MyAccountListOrdersProps) {
  const router = useRouter()
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
        const { text, page, ...rest } = router.query
        router.push({
          pathname: '/account/orders',
          query: {
            ...rest,
            ...(value ? { text: value } : {}),
          },
        })
      }
    },
    300,
    String(router.query.text)
  )

  const selectedFacets: SelectedFacet[] = getSelectedFacets({ filters })
  const allFacets = getAllFacets({ filters })

  const filter = useMyAccountFilter({
    allFacets,
    selectedFacets,
  })

  const { openFilter, filter: displayFilter } = useUI()

  if (listOrders.list.length === 0) {
    return (
      <div className={styles.page}>
        <MyAccountListOrdersEmptyState />
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <div data-fs-list-orders>
        <h1 data-fs-list-orders-title>Orders</h1>
        <div data-fs-list-orders-header>
          <div data-fs-list-orders-search-filters>
            <SearchInputField
              ref={searchInputRef}
              data-fs-search-input-field-list-orders
              placeholder="Search"
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
              variant="tertiary"
              icon={
                <Icon
                  width={16}
                  height={16}
                  name="FadersHorizontal"
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
          {isDesktop && (
            <Pagination page={filters.page} total={total} perPage={perPage} />
          )}
        </div>

        <SelectedFiltersTags
          filters={{
            status: filters.status,
            dateInitial: filters.dateInitial,
            dateFinal: filters.dateFinal,
          }}
          onClearAll={() => {
            router.push({
              pathname: '/account/orders',
              query: {},
            })
          }}
          onRemoveFilter={(key, value) => {
            const { page, clientEmail, ...updatedFilters } = { ...filters }

            if (key === 'status' && Array.isArray(updatedFilters[key])) {
              updatedFilters[key] = updatedFilters[key].filter(
                (v) => v !== value
              )
            } else if (key === 'dateInitial' || key === 'dateFinal') {
              delete updatedFilters.dateInitial
              delete updatedFilters.dateFinal
            } else {
              delete updatedFilters[key]
            }

            if (key === 'status' && Array.isArray(updatedFilters[key])) {
              updatedFilters[key] = updatedFilters[key].filter(
                (v) => v.toLowerCase() !== value.toLowerCase()
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

            router.push({
              pathname: '/account/orders',
              query: filteredQuery,
            })
          }}
        />

        {displayFilter && (
          <MyAccountFilterSlider
            {...filter}
            title="Filters"
            clearButtonLabel="Clear All"
            applyButtonLabel="View Results"
            searchInputRef={searchInputRef}
          />
        )}

        <MyAccountListOrdersTable
          listOrders={listOrders}
          total={total}
          perPage={perPage}
          filters={filters}
        />
      </div>
      {!isDesktop && (
        <Pagination page={filters.page} total={total} perPage={perPage} />
      )}
    </div>
  )
}
