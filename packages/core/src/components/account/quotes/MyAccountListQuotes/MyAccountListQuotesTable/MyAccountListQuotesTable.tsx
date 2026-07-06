import { Icon, IconButton } from '@faststore/ui'

import MyAccountQuoteStatusBadge from './MyAccountQuoteStatusBadge'
import { useSession } from 'src/sdk/session'
import useScreenResize from 'src/sdk/ui/useScreenResize'
import type { ServerListQuotesQueryQuery } from '@generated/graphql'

function formatDateTime(isoString: string, locale: string) {
  if (!isoString) return ''
  const parsed = new Date(isoString)
  if (Number.isNaN(parsed.getTime())) return isoString
  return parsed.toLocaleString(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

function formatDateShort(isoString: string, locale: string) {
  if (!isoString) return ''
  const parsed = new Date(isoString)
  if (Number.isNaN(parsed.getTime())) return isoString
  return parsed.toLocaleDateString(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

function getRelativeExpiry(isoString: string): string | null {
  const diffMs = new Date(isoString).getTime() - Date.now()
  if (diffMs <= 0) return null

  const hours = Math.floor(diffMs / 3_600_000)
  const days = Math.floor(diffMs / 86_400_000)
  const weeks = Math.floor(days / 7)
  const months = Math.floor(days / 30)

  if (hours < 24) return `${hours} ${hours === 1 ? 'hour' : 'hours'} left`
  if (days < 14) return `${days} ${days === 1 ? 'day' : 'days'} left`
  if (weeks < 8) return `${weeks} ${weeks === 1 ? 'week' : 'weeks'} left`
  return `${months} ${months === 1 ? 'month' : 'months'} left`
}

function formatAmount(amount: number, locale: string, currencyCode: string) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currencyCode,
    minimumFractionDigits: 2,
  }).format(amount)
}

type MyAccountListQuotesTableProps = Readonly<{
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
    label: string
  }
}>

export function Pagination({
  page,
  total,
  perPage,
}: Readonly<{
  page: number
  total: number
  perPage: number
}>) {
  const totalPages = Math.ceil(total / perPage)
  const firstIndexLabel = page === 1 ? 1 : (page - 1) * perPage + 1
  const lastIndexLabel = Math.min(firstIndexLabel + perPage - 1, total)

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(globalThis.location.search)
    if (newPage === 1 || newPage === 0) {
      params.delete('page')
    } else {
      params.set('page', String(newPage))
    }
    const search = params.toString()
    globalThis.location.href = search
      ? `/pvt/account/quotes?${search}`
      : '/pvt/account/quotes'
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
      <div data-fs-quotes-list>
        {listQuotes.list.map((item) => {
          const relativeExpiry = getRelativeExpiry(item.expiresAt)
          const formattedAmount = formatAmount(
            item.amount,
            locale,
            currencyCode
          )

          return (
            <div data-fs-quotes-list-row key={item.id}>
              {/* Left: ID + label */}
              <div data-fs-quotes-list-col-main>
                <p data-fs-quotes-list-id>{item.id}</p>
                {item.label && <p data-fs-quotes-list-label>{item.label}</p>}
              </div>

              {/* Middle: created by + dates (desktop only) */}
              {isDesktop && (
                <div data-fs-quotes-list-col-dates>
                  {item.createdBy && (
                    <div data-fs-quotes-list-date-group>
                      <span data-fs-quotes-list-date-label>Created by</span>
                      <span data-fs-quotes-list-date-value>
                        {item.createdBy}
                      </span>
                    </div>
                  )}
                  <div data-fs-quotes-list-date-group>
                    <span data-fs-quotes-list-date-label>Creation date</span>
                    <span data-fs-quotes-list-date-value>
                      {formatDateTime(item.createdAt, locale)}
                    </span>
                  </div>
                  <div data-fs-quotes-list-date-group>
                    <span data-fs-quotes-list-date-label>Expires on</span>
                    <span data-fs-quotes-list-date-value>
                      {formatDateShort(item.expiresAt, locale)}
                      {relativeExpiry && (
                        <span data-fs-quotes-list-relative-expiry>
                          {' · '}
                          {relativeExpiry}
                        </span>
                      )}
                    </span>
                  </div>
                </div>
              )}

              {/* Right: badge + total */}
              <div data-fs-quotes-list-col-status>
                <MyAccountQuoteStatusBadge status={item.status} />
                <p data-fs-quotes-list-total>
                  Total <strong>{formattedAmount}</strong>
                </p>
              </div>
            </div>
          )
        })}
      </div>
      <Pagination page={filters.page} total={total} perPage={perPage} />
    </>
  )
}
