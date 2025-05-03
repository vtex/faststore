import type { Locator } from '@vtex/client-cms'
import type { GetServerSideProps } from 'next'
import { NextSeo } from 'next-seo'
import { useCallback, type ComponentType } from 'react'
import { MyAccountLayout } from 'src/components/account'
import RenderSections from 'src/components/cms/RenderSections'
import { default as GLOBAL_COMPONENTS } from 'src/components/cms/global/Components'
import CUSTOM_COMPONENTS from 'src/customizations/src/components'

import { getGlobalSectionsData } from 'src/components/cms/GlobalSections'

import { gql } from '@generated/gql'
import type {
  ServerListOrdersQueryQuery,
  ServerListOrdersQueryQueryVariables,
} from '@generated/graphql'
import { useRouter } from 'next/router'
import { default as AfterSection } from 'src/customizations/src/myAccount/extensions/orders/after'
import { default as BeforeSection } from 'src/customizations/src/myAccount/extensions/orders/before'
import type { MyAccountProps } from 'src/experimental/myAccountSeverSideProps'
import { execute } from 'src/server'
import { injectGlobalSections } from 'src/server/cms/global'
import { getMyAccountRedirect } from 'src/utils/myAccountRedirect'

import Image from 'next/image'

import { Badge, Button, Icon, SearchInputField } from '@faststore/ui'
import { useSession } from 'src/sdk/session'
import {
  orderStatusMap,
  type OrderStatusKey,
  type OrderStatusMapValue,
} from 'src/utils/userOrderStatus'
import styles from './styles.module.scss'

/* A list of components that can be used in the CMS. */
const COMPONENTS: Record<string, ComponentType<any>> = {
  ...GLOBAL_COMPONENTS,
  ...CUSTOM_COMPONENTS,
}

type ListOrdersPageProps = {
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
} & MyAccountProps

function formatShippingDate(date: string, locale: string) {
  return new Date(date).toLocaleDateString(locale, {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
}

function getStatusVariant({ status }: { status: string }) {
  const variant =
    (orderStatusMap[status as OrderStatusKey] as OrderStatusMapValue)
      ?.variant || 'neutral'

  return variant.charAt(0).toUpperCase() + variant.slice(1)
}

export default function ListOrdersPage({
  globalSections,
  listOrders,
  total,
  perPage,
  filters,
}: ListOrdersPageProps) {
  const router = useRouter()
  console.log('🚀 ~ listOrders:', listOrders)

  const { locale } = useSession()

  const formatPrice = useCallback(
    (value: number, currencyCode: string) => {
      return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currencyCode,
        minimumFractionDigits: 2,
      }).format(value / 100)
    },
    [locale]
  )

  const handleFilterChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ): void => {
    const { name, value } = e.target

    router.push({
      pathname: '/account/orders',
      query: {
        ...router.query,
        [name]: value,
        page: 1,
      },
    })
  }

  const handleStatusChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ): void => {
    const { value } = e.target
    if (value === '' || value === 'all') {
      const { status: emptyStatus, page, ...rest } = router.query
      router.push({
        pathname: '/account/orders',
        query: {
          ...rest,
        },
      })
      return
    }

    const selectedOptions = Array.from(
      (e.target as HTMLSelectElement).selectedOptions
    )

    const { page, status, ...rest } = router.query
    const selectedValues = selectedOptions.map((option) => option.value)

    const previousStatus = (
      Array.isArray(status) ? status : [status]
    ) as string[]

    router.push({
      pathname: '/account/orders',
      query: {
        ...rest,
        status: [...previousStatus, ...selectedValues].filter(Boolean),
      },
    })
  }

  const handlePageChange = (newPage: number) => {
    router.push({
      pathname: '/account/orders',
      query: {
        ...router.query,
        page: newPage,
      },
    })
  }

  const handleOrderDetail = ({ orderId }: { orderId: string }) => {
    router.push({
      pathname: `/account/orders/${orderId}`,
    })
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target
    router.push({
      pathname: '/account/orders',
      query: {
        ...router.query,
        text: value,
        page: 1,
      },
    })
  }

  const handleSearchSubmit = (value: string) => {
    router.push({
      pathname: '/account/orders',
      query: {
        ...router.query,
        text: value,
        page: 1,
      },
    })
  }

  const totalPages = Math.ceil(total / perPage)

  return (
    <RenderSections
      globalSections={globalSections.sections}
      components={COMPONENTS}
    >
      <NextSeo noindex nofollow />

      <MyAccountLayout>
        <BeforeSection />
        <div className={styles.container}>
          <h1 className={styles.title}>Orders</h1>

          <div className={styles.searchFiltersContainer}>
            <SearchInputField
              data-fs-search-input-field-list-orders
              placeholder="Search"
              onChange={(e) => handleSearchChange(e)}
              onSubmit={(e) => handleSearchSubmit(e)}
              // value={}
            />
            <Button
              data-fs-button-list-orders-filter-button
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
              onClick={() => console.log('Hi')}
            >
              Filters
            </Button>
          </div>

          <table className={styles.table}>
            <thead>
              <tr>
                <th>Order</th>
                <th>Ordered by</th>
                <th>Cost Center</th>
                <th>Release</th>
                <th>PO number</th>
                <th>Delivery by</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {listOrders.list.map((item) => (
                // biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
                <tr
                  key={item.orderId}
                  onClick={() => handleOrderDetail({ orderId: item.orderId })}
                  role="button"
                >
                  <td>
                    <div className={styles.imageContainer}>
                      <Image
                        src={item.items?.[0]?.imageUrl || '/placeholder.png'}
                        alt={item.items?.[0]?.description || 'Product image'}
                        width={64}
                        height={64}
                        onError={(e) => {
                          e.currentTarget.src = '/placeholder.png'
                        }}
                      />
                      {item.totalItems > 0 && (
                        <Badge counter>{item.totalItems}</Badge>
                      )}
                    </div>
                    <div>
                      <p>{item.orderId || '-'}</p>
                      <p>
                        Placed on{' '}
                        {item.creationDate
                          ? formatShippingDate(item.creationDate, locale)
                          : '-'}
                      </p>
                      <p>
                        Total: {formatPrice(item.totalValue, item.currencyCode)}
                      </p>
                    </div>
                  </td>
                  <td>{item?.clientName}</td>
                  <td>{item?.costCenter || '(Cost Center)'}</td>
                  <td>{item?.release || '(Release)'}</td>
                  <td>{item?.poNumber || '(PO Number)'}</td>
                  <td>
                    {item.ShippingEstimatedDate
                      ? formatShippingDate(item.ShippingEstimatedDate, locale)
                      : '-'}
                  </td>
                  <td>
                    <span
                      className={`${styles.status} ${
                        styles[
                          `status${getStatusVariant({ status: item.status })}`
                        ]
                      }`}
                    >
                      {orderStatusMap[item.status as OrderStatusKey]?.label ||
                        item.statusDescription ||
                        '-'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className={styles.pagination}>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                type="button"
                key={i}
                className={i + 1 === filters?.page ? styles.active : ''}
                onClick={() => handlePageChange(i + 1)}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>
        <AfterSection />
      </MyAccountLayout>
    </RenderSections>
  )
}

const query = gql(`
  query ServerListOrdersQuery ($page: Int,$perPage: Int, $status: [String], $dateInitial: String, $dateFinal: String, $text: String, $clientEmail: String) {
    listUserOrders (page: $page, perPage: $perPage, status: $status, dateInitial: $dateInitial, dateFinal: $dateFinal, text: $text, clientEmail: $clientEmail) {
      list {
        orderId
        creationDate
        clientName
        items {
          seller
          quantity
          description
          ean
          refId
          id
          productId
          sellingPrice
          price
        }
        totalValue
        paymentNames
        status
        statusDescription
        marketPlaceOrderId
        sequence
        salesChannel
        affiliateId
        origin
        workflowInErrorState
        workflowInRetry
        lastMessageUnread
        ShippingEstimatedDate
        ShippingEstimatedDateMax
        ShippingEstimatedDateMin
        orderIsComplete
        listId
        listType
        authorizedDate
        callCenterOperatorName
        totalItems
        currencyCode
        hostname
        invoiceOutput
        invoiceInput
        lastChange
        isAllDelivered
        isAnyDelivered
        giftCardProviders
        orderFormId
        paymentApprovedDate
        readyForHandlingDate
        deliveryDates
      }
      paging {
        total
        pages
        currentPage
        perPage
      }
      stats {
        stats {
          totalValue {
            Count
            Max
            Mean
            Min
            Missing
            StdDev
            Sum
            SumOfSquares
            Facets
          }
          totalItems {
            Count
            Max
            Mean
            Min
            Missing
            StdDev
            Sum
            SumOfSquares
            Facets
          }
        }
      }
      facets
      reportRecordsLimit
    }
  }
`)

export const getServerSideProps: GetServerSideProps<
  MyAccountProps,
  Record<string, string>,
  Locator
> = async (context) => {
  // TODO validate permissions here

  const { previewData } = context

  const { isFaststoreMyAccountEnabled, redirect } = getMyAccountRedirect({
    query: context.query,
  })
  console.log('🚀 ~ context.query:', context.query)

  if (!isFaststoreMyAccountEnabled) {
    return { redirect }
  }

  const [
    globalSectionsPromise,
    globalSectionsHeaderPromise,
    globalSectionsFooterPromise,
  ] = getGlobalSectionsData(previewData)

  const page = Number(context.query.page as string | undefined) || 1
  const perPage = 10 // TODO: make this configurable
  const status =
    (Array.isArray(context.query.status)
      ? context.query.status
      : [context.query.status]
    ).filter(Boolean) || []
  const dateInitial = (context.query.dateInitial as string | undefined) || ''
  const dateFinal = (context.query.dateFinal as string | undefined) || ''
  const text = (context.query.text as string | undefined) || ''
  const clientEmail = (context.query.clientEmail as string | undefined) || ''

  const [
    listOrders,
    globalSections,
    globalSectionsHeader,
    globalSectionsFooter,
  ] = await Promise.all([
    execute<ServerListOrdersQueryQueryVariables, ServerListOrdersQueryQuery>(
      {
        variables: {
          page,
          perPage,
          status,
          dateInitial,
          dateFinal,
          text,
          clientEmail,
        },
        operation: query,
      },
      { headers: { ...context.req.headers } }
    ),
    globalSectionsPromise,
    globalSectionsHeaderPromise,
    globalSectionsFooterPromise,
  ])

  if (listOrders.errors) {
    return {
      notFound: true,
    }
  }

  const globalSectionsResult = injectGlobalSections({
    globalSections,
    globalSectionsHeader,
    globalSectionsFooter,
  })

  return {
    props: {
      globalSections: globalSectionsResult,
      listOrders: listOrders.data.listUserOrders,
      total: listOrders.data.listUserOrders.paging.total,
      perPage: listOrders.data.listUserOrders.paging.perPage,
      filters: {
        page: listOrders.data.listUserOrders.paging.currentPage ?? page,
        status,
        dateInitial,
        dateFinal,
        text,
        clientEmail,
      },
    },
  }
}
