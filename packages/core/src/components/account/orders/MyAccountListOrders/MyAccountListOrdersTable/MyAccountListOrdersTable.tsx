import { Button, Icon } from '@faststore/ui'
import type { ServerListOrdersQueryQuery } from '@generated/graphql'
import { useRouter } from 'next/router'

import MyAccountStatusBadge from 'src/components/account/components/MyAccountStatusBadge'
import { useFormatPrice } from 'src/components/account/utils/useFormatPrice'
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

export function Pagination({
  page,
  total,
  perPage,
}: {
  page: number
  total: number
  perPage: number
}) {
  const router = useRouter()
  const totalPages = Math.ceil(total / perPage)
  const firstIndexLabel = page === 1 ? 1 : (page - 1) * perPage + 1
  const lastIndexLabel =
    total > firstIndexLabel + perPage - 1
      ? firstIndexLabel + perPage - 1
      : total

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

  return (
    <div data-fs-list-orders-table-pagination>
      <p>{`${firstIndexLabel} — ${lastIndexLabel} of ${total}`}</p>
      <Button
        size="small"
        variant="tertiary"
        disabled={page === 1}
        onClick={() => handlePageChange(page - 1)}
        icon={
          <Icon
            width={16}
            height={16}
            name="CaretLeft"
            aria-label="Previous Page"
          />
        }
        iconPosition="left"
      ></Button>
      <Button
        size="small"
        variant="tertiary"
        disabled={page === totalPages}
        onClick={() => handlePageChange(page + 1)}
        icon={
          <Icon
            width={16}
            height={16}
            name="CaretRight"
            aria-label="Next Page"
          />
        }
        iconPosition="left"
      ></Button>
    </div>
  )
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
  const formatPrice = useFormatPrice()

  const handleOrderDetail = ({ orderId }: { orderId: string }) => {
    router.push({
      pathname: `/account/orders/${orderId}`,
    })
  }

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
      {isDesktop && (
        <Pagination page={filters.page} total={total} perPage={perPage} />
      )}
    </>
  )
}
