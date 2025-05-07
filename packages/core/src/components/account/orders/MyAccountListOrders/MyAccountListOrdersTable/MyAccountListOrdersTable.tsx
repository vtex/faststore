import { useCallback } from 'react'

import type { ServerListOrdersQueryQuery } from '@generated/graphql'
import { useRouter } from 'next/router'

import Image from 'next/image'

import { Badge } from '@faststore/ui'
import MyAccountStatusBadge from 'src/components/account/components/MyAccountStatusBadge'
import { useSession } from 'src/sdk/session'
import useScreenResize from 'src/sdk/ui/useScreenResize'
import styles from './styles.module.scss'

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
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Order</th>
            {isDesktop && (
              <>
                <th>Ordered by</th>
                <th>Cost Center</th>
                <th>Release</th>
                <th>PO number</th>
                <th>Delivery by</th>
              </>
            )}
            <th> {isDesktop && <>Status</>}</th>
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

              {isDesktop && (
                <>
                  <td>{item?.clientName}</td>
                  <td>{item?.costCenter || '(Cost Center)'}</td>
                  <td>{item?.release || '(Release)'}</td>
                  <td>{item?.poNumber || '(PO Number)'}</td>
                  <td>
                    {item.ShippingEstimatedDate
                      ? formatShippingDate(item.ShippingEstimatedDate, locale)
                      : '-'}
                  </td>
                </>
              )}

              <td>
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
    </>
  )
}
