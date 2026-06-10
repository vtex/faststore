import { Icon, IconButton } from '@faststore/ui'

import MyAccountQuoteStatusBadge from './MyAccountQuoteStatusBadge'
import { useSession } from 'src/sdk/session'
import useScreenResize from 'src/sdk/ui/useScreenResize'
import type { ServerListQuotesQueryQuery } from '@generated/graphql'

function formatDate(date: string, locale: string) {
  return new Date(date).toLocaleDateString(locale, {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
}

function formatAmount(amount: number, locale: string, currencyCode: string) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currencyCode,
    minimumFractionDigits: 2,
  }).format(amount)
}

type MyAccountListQuotesTableProps = {
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
    window.location.href = `/pvt/account/quotes${params.toString() ? `?${params}` : ''}`
  }

  return (
    <div data-fs-list-orders-table-pagination>
      <p>{`${firstIndexLabel} — ${lastIndexLabel} of ${total}`}</p>
      <IconButton
        size="small"
        variant="tertiary"
        disabled={page === 1}
        onClick={() => handlePageChange(page - 1)}
        icon={<Icon name="CaretLeft" />}
        aria-label="Previous Page"
      />
      <IconButton
        size="small"
        variant="tertiary"
        disabled={page === totalPages}
        onClick={() => handlePageChange(page + 1)}
        icon={<Icon name="CaretRight" />}
        aria-label="Next Page"
      />
    </div>
  )
}

export default function MyAccountListQuotesTable({
  listQuotes,
  total,
  perPage,
  filters,
}: MyAccountListQuotesTableProps) {
  const { isDesktop } = useScreenResize()
  const { locale, currency } = useSession()
  const currencyCode = currency.code

  return (
    <>
      <table data-fs-list-orders-table>
        <tbody data-fs-list-orders-table-body>
          {listQuotes.list.map((item) => {
            const quoteUrl = `/pvt/account/quotes/${item.id}`
            const createdDate = formatDate(item.createdAt, locale)
            const expiresDate = formatDate(item.expiresAt, locale)
            const formattedAmount = formatAmount(
              item.amount,
              locale,
              currencyCode
            )

            const handleRowClick = () => {
              window.location.href = quoteUrl
            }

            const handleRowKeyDown = (e: React.KeyboardEvent) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                window.location.href = quoteUrl
              }
            }

            return (
              <tr
                data-fs-list-orders-table-row
                key={item.id}
                onClick={handleRowClick}
                onKeyDown={handleRowKeyDown}
                tabIndex={0}
                aria-label={`View quote ${item.label ?? item.id} details`}
              >
                <td data-fs-list-orders-table-cell>
                  <div data-fs-list-orders-table-product-info-main>
                    <p
                      data-fs-list-orders-table-product-info-order-id
                      title={`ID: ${item.id}`}
                    >
                      {item.label ?? item.id}
                    </p>
                    <p
                      data-fs-list-orders-table-product-info-order-total
                      title={`Amount: ${formattedAmount}`}
                    >
                      {formattedAmount}
                    </p>
                  </div>
                </td>

                {isDesktop && (
                  <>
                    <td data-fs-list-orders-table-cell>
                      <div data-fs-list-orders-table-product-info>
                        <p data-fs-list-orders-table-product-info-label>
                          Created
                        </p>
                        <p
                          data-fs-list-orders-table-product-info-value
                          title={createdDate}
                        >
                          {createdDate}
                        </p>
                      </div>
                    </td>
                    <td data-fs-list-orders-table-cell>
                      <div data-fs-list-orders-table-product-info>
                        <p data-fs-list-orders-table-product-info-label>
                          Expires
                        </p>
                        <p
                          data-fs-list-orders-table-product-info-value
                          title={expiresDate}
                        >
                          {expiresDate}
                        </p>
                      </div>
                    </td>
                  </>
                )}

                <td data-fs-list-orders-table-cell>
                  <MyAccountQuoteStatusBadge status={item.status} />
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
