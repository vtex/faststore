import { Icon, IconButton } from '@faststore/ui'

import MyAccountQuoteStatusBadge from './MyAccountQuoteStatusBadge'
import { useSession } from 'src/sdk/session'
import useScreenResize from 'src/sdk/ui/useScreenResize'
import type { ServerListQuotesQueryQuery } from '@generated/graphql'
import type { MyAccountListQuotesSectionLabels } from '../quotesLabels'
import {
  formatRelativeExpiryLabel,
  pickQuoteStatusCmsLabels,
  resolveMyAccountListQuotesLabels,
} from '../quotesLabels'

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

function getRelativeExpiry(
  isoString: string,
  labels: Required<MyAccountListQuotesSectionLabels>
): string | null {
  const diffMs = new Date(isoString).getTime() - Date.now()
  if (diffMs <= 0) return null

  const hours = Math.floor(diffMs / 3_600_000)
  const days = Math.floor(diffMs / 86_400_000)
  const weeks = Math.floor(days / 7)
  const months = Math.floor(days / 30)

  if (hours < 24) return formatRelativeExpiryLabel(hours, 'hour', labels)
  if (days < 14) return formatRelativeExpiryLabel(days, 'day', labels)
  if (weeks < 8) return formatRelativeExpiryLabel(weeks, 'week', labels)
  return formatRelativeExpiryLabel(months, 'month', labels)
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
  labels?: MyAccountListQuotesSectionLabels
}>

export function Pagination({
  page,
  total,
  perPage,
  labels: labelsProp,
}: Readonly<{
  page: number
  total: number
  perPage: number
  labels?: MyAccountListQuotesSectionLabels
}>) {
  const labels = resolveMyAccountListQuotesLabels(labelsProp)
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
      <p>{`${firstIndexLabel} — ${lastIndexLabel} ${labels.paginationOfLabel} ${total}`}</p>
      <IconButton
        size="small"
        variant="tertiary"
        disabled={page === 1}
        onClick={() => handlePageChange(page - 1)}
        icon={<Icon name="CaretLeft" />}
        aria-label={labels.previousPageLabel}
      />
      <IconButton
        size="small"
        variant="tertiary"
        disabled={page === totalPages}
        onClick={() => handlePageChange(page + 1)}
        icon={<Icon name="CaretRight" />}
        aria-label={labels.nextPageLabel}
      />
    </div>
  )
}

export default function MyAccountListQuotesTable({
  listQuotes,
  total,
  perPage,
  filters,
  labels: labelsProp,
}: MyAccountListQuotesTableProps) {
  const labels = resolveMyAccountListQuotesLabels(labelsProp)
  const statusCmsLabels = pickQuoteStatusCmsLabels(labels)
  const { isDesktop } = useScreenResize()
  const { locale, currency } = useSession()
  const currencyCode = currency.code

  return (
    <>
      <div data-fs-quotes-list>
        {listQuotes.list.map((item) => {
          const relativeExpiry = getRelativeExpiry(item.expiresAt, labels)
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
                      <span data-fs-quotes-list-date-label>
                        {labels.createdByLabel}
                      </span>
                      <span data-fs-quotes-list-date-value>
                        {item.createdBy}
                      </span>
                    </div>
                  )}
                  <div data-fs-quotes-list-date-group>
                    <span data-fs-quotes-list-date-label>
                      {labels.creationDateLabel}
                    </span>
                    <span data-fs-quotes-list-date-value>
                      {formatDateTime(item.createdAt, locale)}
                    </span>
                  </div>
                  <div data-fs-quotes-list-date-group>
                    <span data-fs-quotes-list-date-label>
                      {labels.expiresOnLabel}
                    </span>
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
                <MyAccountQuoteStatusBadge
                  status={item.status}
                  statusCmsLabels={statusCmsLabels}
                />
                <p data-fs-quotes-list-total>
                  {labels.totalLabel} <strong>{formattedAmount}</strong>
                </p>
              </div>
            </div>
          )
        })}
      </div>
      <Pagination
        page={filters.page}
        total={total}
        perPage={perPage}
        labels={labels}
      />
    </>
  )
}
