import { Button, Icon } from '@vtex/faststore-ui'
import { useState } from 'react'
import type { ServerListOrdersQueryQuery } from '../../../../../../@generated/graphql'

import { useSession } from '../../../../../sdk/session'
import useScreenResize from '../../../../../sdk/ui/useScreenResize'
import MyAccountStatusBadge from '../../../components/MyAccountStatusBadge'
import { useFormatPrice } from '../../../utils/useFormatPrice'
import { ExpandButton } from './ExpandButton/ExpandButton'

const MAX_ITEM_FIELDS = 5
const MAX_ORDER_FIELDS = 5

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
  const totalPages = Math.ceil(total / perPage)
  const firstIndexLabel = page === 1 ? 1 : (page - 1) * perPage + 1
  const lastIndexLabel =
    total > firstIndexLabel + perPage - 1
      ? firstIndexLabel + perPage - 1
      : total

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(window.location.search)
    if (newPage === 1 || newPage === 0) {
      params.delete('page')
    } else {
      params.set('page', String(newPage))
    }
    window.location.href = `/pvt/account/orders${params.toString() ? `?${params}` : ''}`
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
  const { isDesktop } = useScreenResize()
  const { locale } = useSession()
  const formatPrice = useFormatPrice()

  const [expandedRows, setExpandedRows] = useState<
    Record<string, { item: boolean; order: boolean }>
  >({})

  const handleToggle = (orderId: string, type: 'item' | 'order') => {
    setExpandedRows((prev) => ({
      ...prev,
      [orderId]: {
        ...prev[orderId],
        [type]: !prev[orderId]?.[type],
      },
    }))
  }

  return (
    <>
      <table data-fs-list-orders-table>
        <tbody data-fs-list-orders-table-body>
          {listOrders.list.map((item) => {
            const orderLevel =
              item?.customFields?.find(({ type }) => type === 'order')?.value ||
              []
            const itemLevel =
              item?.customFields?.find(({ type }) => type === 'item')?.value ||
              []

            const hasOrderOrItemCustomFields =
              (orderLevel && orderLevel.length > 0) ||
              (itemLevel && itemLevel.length > 0)

            const isItemFieldsExpanded =
              expandedRows[item.orderId]?.item || false
            const isOrderFieldsExpanded =
              expandedRows[item.orderId]?.order || false

            const {
              displayed: displayedItemLevel,
              shouldShowButton: shouldShowViewMoreButtonToItemsFields,
            } = getLevel({
              level: itemLevel,
              isExpanded: isItemFieldsExpanded,
              max: MAX_ITEM_FIELDS,
            })

            const {
              displayed: displayedOrderLevel,
              shouldShowButton: shouldShowViewMoreButtonToOrderFields,
            } = getLevel({
              level: orderLevel,
              isExpanded: isOrderFieldsExpanded,
              max: MAX_ORDER_FIELDS,
            })

            const orderUrl = `/pvt/account/orders/${item.orderId}`
            const shippingEstimatedDate = item.ShippingEstimatedDate
              ? formatOrderDate(item.ShippingEstimatedDate, locale)
              : '-'
            const creationDate = item.creationDate
              ? formatOrderDate(item.creationDate, locale)
              : '-'
            const clientName = item.clientName ? item.clientName : '-'
            const totalPrice = formatPrice(item.totalValue, item.currencyCode)
            const deliveryBy = item.ShippingEstimatedDate
              ? `Delivery by ${formatOrderDate(
                  item.ShippingEstimatedDate,
                  locale
                )}`
              : '-'

            const additionalInfoIdOrder = `additional-info-${item.orderId}-order`
            const additionalInfoIdItem = `additional-info-${item.orderId}-item`

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
                    <p
                      data-fs-list-orders-table-product-info-order-id
                      title={`ID: ${item.orderId || '-'}`}
                    >
                      {item.orderId || '-'}
                    </p>
                    <p
                      data-fs-list-orders-table-product-info-order-total
                      title={`Total: ${totalPrice}`}
                    >
                      Total: {totalPrice}
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
                        <p
                          data-fs-list-orders-table-product-info-value
                          title={creationDate}
                        >
                          {creationDate}
                        </p>
                      </div>
                      {hasOrderOrItemCustomFields && (
                        <>
                          <div data-fs-list-orders-table-product-info>
                            <p data-fs-list-orders-table-product-info-label>
                              Delivery by
                            </p>
                            <p
                              data-fs-list-orders-table-product-info-value
                              title={shippingEstimatedDate}
                            >
                              {shippingEstimatedDate}
                            </p>
                          </div>
                          <div data-fs-list-orders-table-product-info>
                            <p data-fs-list-orders-table-product-info-label>
                              Placed by
                            </p>
                            <p
                              data-fs-list-orders-table-product-info-value
                              title={clientName}
                            >
                              {clientName}
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
                            <p
                              data-fs-list-orders-table-product-info-value
                              title={shippingEstimatedDate}
                            >
                              {shippingEstimatedDate}
                            </p>
                          </div>
                        </td>
                        <td data-fs-list-orders-table-cell>
                          <div data-fs-list-orders-table-product-info>
                            <p data-fs-list-orders-table-product-info-label>
                              Placed by
                            </p>
                            <p
                              data-fs-list-orders-table-product-info-value
                              title={clientName}
                            >
                              {clientName}
                            </p>
                          </div>
                        </td>
                      </>
                    )}
                    {hasOrderOrItemCustomFields && (
                      <>
                        <td data-fs-list-orders-table-cell>
                          {displayedOrderLevel.length > 0 && (
                            <p
                              data-fs-list-orders-table-product-info-label
                              id={additionalInfoIdOrder}
                            >
                              Order fields
                            </p>
                          )}
                          {displayedOrderLevel.map(
                            (field: string, idx: number) => (
                              <p
                                key={field + idx}
                                data-fs-list-orders-table-product-info-order
                                title={field}
                                aria-owns={additionalInfoIdOrder}
                              >
                                {field}
                              </p>
                            )
                          )}
                          {shouldShowViewMoreButtonToOrderFields && (
                            <ExpandButton
                              ariaControls={additionalInfoIdOrder}
                              isExpanded={isOrderFieldsExpanded}
                              count={orderLevel.length - MAX_ORDER_FIELDS}
                              onToggle={() =>
                                handleToggle(item.orderId, 'order')
                              }
                            />
                          )}
                        </td>
                        <td data-fs-list-orders-table-cell>
                          {displayedItemLevel.length > 0 && (
                            <p
                              data-fs-list-orders-table-product-info-label
                              id={additionalInfoIdItem}
                            >
                              Item fields
                            </p>
                          )}
                          {displayedItemLevel.map(
                            (field: string, idx: number) => (
                              <p
                                key={field + idx}
                                data-fs-list-orders-table-product-info-item
                                title={field}
                                aria-owns={additionalInfoIdItem}
                              >
                                {field}
                              </p>
                            )
                          )}
                          {shouldShowViewMoreButtonToItemsFields && (
                            <ExpandButton
                              ariaControls={additionalInfoIdItem}
                              isExpanded={isItemFieldsExpanded}
                              count={itemLevel.length - MAX_ITEM_FIELDS}
                              onToggle={() =>
                                handleToggle(item.orderId, 'item')
                              }
                            />
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
                  {!isDesktop && <p>{deliveryBy}</p>}
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

function getLevel({
  level,
  isExpanded,
  max,
}: {
  level: string[]
  isExpanded?: boolean
  max: number
}) {
  const shouldShowButton = level.length > max
  const displayed = isExpanded ? level : level.slice(0, max)

  return { displayed, shouldShowButton }
}
