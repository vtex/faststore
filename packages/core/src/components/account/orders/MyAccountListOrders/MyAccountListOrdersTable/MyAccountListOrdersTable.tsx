import { useCallback } from 'react'

import type { ServerListOrdersQueryQuery } from '@generated/graphql'
import { useRouter } from 'next/router'

import { Button } from '@faststore/ui'
import MyAccountStatusBadge from 'src/components/account/components/MyAccountStatusBadge'
import { useSession } from 'src/sdk/session'
import useScreenResize from 'src/sdk/ui/useScreenResize'

function formatShippingDate(date: string, locale: string) {
  return new Date(date).toLocaleDateString(locale, {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
}

type MyAccountListOrdersTableProps = {
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

export default function MyAccountListOrdersTable({
  listOrders,
  total,
  perPage,
  filters,
}: MyAccountListOrdersTableProps) {
  const router = useRouter()

  const { isDesktop } = useScreenResize()

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

  const handlePageChange = (newPage: number) => {
    const { page, ...rest } = router.query
    const isFirstPage = newPage === 0 || newPage === 1
    router.push({
      pathname: '/account/orders',
      query: {
        ...rest,
        ...(!isFirstPage ? { page: newPage } : {}),
      },
    })
  }

  const handleOrderDetail = ({ orderId }: { orderId: string }) => {
    router.push({
      pathname: `/account/orders/${orderId}`,
    })
  }

  const totalPages = Math.ceil(total / perPage)
  return (
    <>
      <table data-fs-list-orders-table>
        <thead data-fs-list-orders-table-header>
          <tr
            data-fs-list-orders-table-header-row
            data-fs-list-orders-table-row
          >
            <th data-fs-list-orders-table-header-cell>Order</th>
            {isDesktop && (
              <>
                <th data-fs-list-orders-table-header-cell>Ordered by</th>
                <th data-fs-list-orders-table-header-cell>Cost Center</th>
                <th data-fs-list-orders-table-header-cell>Release</th>
                <th data-fs-list-orders-table-header-cell>PO number</th>
                <th data-fs-list-orders-table-header-cell>Delivery by</th>
              </>
            )}
            <th data-fs-list-orders-table-header-cell>
              {isDesktop && <>Status</>}
            </th>
          </tr>
        </thead>
        <tbody data-fs-list-orders-table-body>
          {listOrders.list.map((item) => (
            // biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
            <tr
              data-fs-list-orders-table-body-row
              data-fs-list-orders-table-row
              key={item.orderId}
              onClick={() => handleOrderDetail({ orderId: item.orderId })}
              role="button"
            >
              <td data-fs-list-orders-table-cell>
                <div data-fs-list-orders-table-product-info>
                  <p data-fs-list-orders-table-product-info-order-id>
                    {item.orderId || '-'}
                  </p>
                  <p data-fs-list-orders-table-product-info-order-date>
                    Placed on{' '}
                    {item.creationDate
                      ? formatShippingDate(item.creationDate, locale)
                      : '-'}
                  </p>
                  <p data-fs-list-orders-table-product-info-order-total>
                    Total: {formatPrice(item.totalValue, item.currencyCode)}
                  </p>
                </div>
              </td>

              {isDesktop && (
                <>
                  <td data-fs-list-orders-table-cell>{item?.clientName}</td>
                  <td data-fs-list-orders-table-cell>
                    <p>(Cost Center)</p>
                  </td>
                  <td data-fs-list-orders-table-cell>
                    <p>(Release)</p>
                  </td>
                  <td data-fs-list-orders-table-cell>
                    <p>(PO Number)</p>
                  </td>
                  <td data-fs-list-orders-table-cell>
                    {item.ShippingEstimatedDate
                      ? formatShippingDate(item.ShippingEstimatedDate, locale)
                      : '-'}
                  </td>
                </>
              )}

              <td data-fs-list-orders-table-cell>
                <MyAccountStatusBadge
                  status={item.status}
                  statusFallback={item.statusDescription}
                />
                {!isDesktop && (
                  <p>
                    {item.ShippingEstimatedDate
                      ? `Delivery by ${formatShippingDate(
                          item.ShippingEstimatedDate,
                          locale
                        )}`
                      : ''}
                  </p>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div data-fs-list-orders-table-pagination>
        {Array.from({ length: totalPages }, (_, i) => (
          <Button
            size="small"
            data-fs-list-orders-table-pagination-button
            key={i}
            data-fs-list-orders-table-pagination-button-active={
              i + 1 === filters?.page ? 'true' : ''
            }
            onClick={() => handlePageChange(i + 1)}
          >
            {i + 1}
          </Button>
        ))}
      </div>
    </>
  )
}
