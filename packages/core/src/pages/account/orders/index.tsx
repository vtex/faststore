import type { Locator } from '@vtex/client-cms'
import type { GetServerSideProps } from 'next'
import { NextSeo } from 'next-seo'
import type { ComponentType } from 'react'
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
import MyAccountListOrdersEmptyState from 'src/components/account/orders/MyAccountListOrders'
import { default as AfterSection } from 'src/customizations/src/myAccount/extensions/orders/after'
import { default as BeforeSection } from 'src/customizations/src/myAccount/extensions/orders/before'
import type { MyAccountProps } from 'src/experimental/myAccountSeverSideProps'
import { execute } from 'src/server'
import { injectGlobalSections } from 'src/server/cms/global'
import { getMyAccountRedirect } from 'src/utils/myAccountRedirect'

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

export default function ListOrdersPage({
  globalSections,
  listOrders,
  total,
  perPage,
  filters,
}: ListOrdersPageProps) {
  const router = useRouter()
  console.log('🚀 ~ listOrders:', listOrders.list)

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
    console.log('🚀 ~ orderId:', orderId)
    router.push({
      pathname: `/account/orders/${orderId}`,
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
        {listOrders.list.length > 0 ? (
          <div className={styles.container}>
            <h1>Orders</h1>

            <div className={styles.filters}>
              <select
                title="Status"
                name="status"
                multiple={true}
                value={
                  Array.isArray(filters.status)
                    ? filters.status
                    : ([filters.status] as any)
                }
                onChange={handleStatusChange}
              >
                <option value="">All</option>
                <option value="ready-for-handling">ready-for-handling</option>
                <option value="canceled">canceled</option>
                <option value="shipped">shipped</option>
              </select>
              <input
                title="Data Inicial"
                name="dateInitial"
                type="date"
                value={filters.dateInitial || ''}
                onChange={handleFilterChange}
              />
              <input
                title="Data Final"
                name="dateFinal"
                type="date"
                value={filters.dateFinal || ''}
                onChange={handleFilterChange}
              />
            </div>

            <table className={styles.table}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Data</th>
                  <th>Client</th>
                  <th>Total</th>
                  <th>Payment</th>
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
                    <td>{item.orderId || '-'}</td>
                    <td>
                      {item.creationDate
                        ? new Date(item.creationDate).toLocaleDateString()
                        : '-'}
                    </td>
                    <td>{item.clientName || '-'}</td>
                    <td>
                      {item.totalValue != null
                        ? `R$ ${(item.totalValue / 100).toFixed(2)}`
                        : '-'}
                    </td>
                    <td>{item.paymentNames || '-'}</td>
                    <td>{item.statusDescription || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className={styles.pagination}>
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  className={i + 1 === filters?.page ? styles.active : ''}
                  onClick={() => handlePageChange(i + 1)}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <>
            <h1 className={styles.title}>Orders</h1>
            <MyAccountListOrdersEmptyState />
          </>
        )}
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
      redirect: {
        destination: '/account/404',
        permanent: false,
      },
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
