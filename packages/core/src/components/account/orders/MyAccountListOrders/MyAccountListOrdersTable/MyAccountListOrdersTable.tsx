import { Button, Icon } from '@faststore/ui'
import type { ServerListOrdersQueryQuery } from '@generated/graphql'
import { useRouter } from 'next/router'
import { useState } from 'react'

import MyAccountStatusBadge from 'src/components/account/components/MyAccountStatusBadge'
import { useFormatPrice } from 'src/components/account/utils/useFormatPrice'
import { useSession } from 'src/sdk/session'
import useScreenResize from 'src/sdk/ui/useScreenResize'

const MAX_COST_CENTERS = 5

function formatOrderDate(date: string, locale: string) {
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
  const hasOrderOrItemCustomFields =
    listOrders?.list?.some(
      (order) =>
        order?.customFields
          ?.filter((field) => field.type === 'order' || field.type === 'item')
          .flatMap((field) => field.value).length > 0
    ) || false

  const { isDesktop } = useScreenResize()
  const { locale } = useSession()
  const formatPrice = useFormatPrice()
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({})

  const handleToggleExpand = (orderId: string) => {
    setExpandedRows((prev) => ({
      ...prev,
      [orderId]: !prev[orderId],
    }))
  }

  return (
    <>
      <table data-fs-list-orders-table>
        <tbody data-fs-list-orders-table-body>
          {listOrders.list.map((item) => {
            const itemLevel =
              item?.customFields?.find(({ type }) => type === 'item')?.value ||
              []
            const isExpanded = expandedRows[item.orderId]
            const shouldShowButton = itemLevel.length > MAX_COST_CENTERS
            const displayedItemLevel = isExpanded
              ? itemLevel
              : itemLevel.slice(0, 5)
            const orderUrl = `/account/orders/${item.orderId}`

            const handleRowClick = () => {
              window.location.href = orderUrl
            }

            const handleRowKeyDown = (e: React.KeyboardEvent) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                window.location.href = orderUrl
              }
            }

            return (
              <tr
                data-fs-list-orders-table-body-row
                data-fs-list-orders-table-row
                key={item.orderId}
                onClick={handleRowClick}
                onKeyDown={handleRowKeyDown}
                tabIndex={0}
                aria-label={`View order ${item.orderId} details`}
              >
                <td data-fs-list-orders-table-cell>
                  <div data-fs-list-orders-table-product-info-main>
                    <p data-fs-list-orders-table-product-info-order-id>
                      {item.orderId || '-'}
                    </p>
                    <p data-fs-list-orders-table-product-info-order-total>
                      Total: {formatPrice(item.totalValue, item.currencyCode)}
                    </p>
                  </div>
                </td>

                {isDesktop && (
                  <>
                    <td data-fs-list-orders-table-cell>
                      <div data-fs-list-orders-table-product-info>
                        <p data-fs-list-orders-table-product-info-label>
                          Placed on
                        </p>
                        <p data-fs-list-orders-table-product-info-value>
                          {item.creationDate
                            ? formatOrderDate(item.creationDate, locale)
                            : '-'}
                        </p>
                      </div>
                      {hasOrderOrItemCustomFields && (
                        <>
                          <div data-fs-list-orders-table-product-info>
                            <p data-fs-list-orders-table-product-info-label>
                              Delivery by
                            </p>
                            <p data-fs-list-orders-table-product-info-value>
                              {item.ShippingEstimatedDate
                                ? formatOrderDate(
                                    item.ShippingEstimatedDate,
                                    locale
                                  )
                                : '-'}
                            </p>
                          </div>
                          <div data-fs-list-orders-table-product-info>
                            <p data-fs-list-orders-table-product-info-label>
                              Placed by
                            </p>
                            <p data-fs-list-orders-table-product-info-value>
                              {item?.clientName}
                            </p>
                            <p data-fs-list-orders-table-product-info-value>
                              {/* {item?.clientOrgName} */}
                            </p>
                          </div>
                        </>
                      )}
                    </td>
                    {!hasOrderOrItemCustomFields && (
                      <>
                        <td data-fs-list-orders-table-cell>
                          <div data-fs-list-orders-table-product-info>
                            <p data-fs-list-orders-table-product-info-label>
                              Delivery by
                            </p>
                            <p data-fs-list-orders-table-product-info-value>
                              {item.ShippingEstimatedDate
                                ? formatOrderDate(
                                    item.ShippingEstimatedDate,
                                    locale
                                  )
                                : '-'}
                            </p>
                          </div>
                        </td>
                        <td data-fs-list-orders-table-cell>
                          <div data-fs-list-orders-table-product-info>
                            <p data-fs-list-orders-table-product-info-label>
                              Placed by
                            </p>
                            <p data-fs-list-orders-table-product-info-value>
                              {item?.clientName}
                            </p>
                            <p data-fs-list-orders-table-product-info-value>
                              {/* {item?.clientOrgName} */}
                            </p>
                          </div>
                        </td>
                      </>
                    )}
                    {hasOrderOrItemCustomFields && (
                      <>
                        <td data-fs-list-orders-table-cell>
                          {item?.customFields
                            ?.find(({ type }) => type === 'order')
                            ?.value?.map((field: string, idx: number) => (
                              <p
                                key={field + idx}
                                data-fs-list-orders-table-product-info-order
                              >
                                {field}
                              </p>
                            ))}
                        </td>
                        <td data-fs-list-orders-table-cell>
                          {displayedItemLevel.map(
                            (field: string, idx: number) => (
                              <p
                                key={field + idx}
                                data-fs-list-orders-table-product-info-item
                              >
                                {field}
                              </p>
                            )
                          )}
                          {shouldShowButton && (
                            <Button
                              data-fs-list-orders-table-expand-button
                              size="small"
                              variant="primary"
                              inverse
                              iconPosition="right"
                              icon={
                                isExpanded ? (
                                  <Icon
                                    width={16}
                                    height={16}
                                    name="CaretUp"
                                    aria-label="Collapse"
                                  />
                                ) : (
                                  <Icon
                                    width={16}
                                    height={16}
                                    name="CaretDown"
                                    aria-label="Expand"
                                  />
                                )
                              }
                              onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                handleToggleExpand(item.orderId)
                              }}
                            >
                              {isExpanded ? 'View less' : 'View all'}
                            </Button>
                          )}
                        </td>
                      </>
                    )}
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
                        ? `Delivery by ${formatOrderDate(
                            item.ShippingEstimatedDate,
                            locale
                          )}`
                        : ''}
                    </p>
                  )}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
      {isDesktop && (
        <Pagination page={filters.page} total={total} perPage={perPage} />
      )}
    </>
  )
}
