import { Button } from '@faststore/ui'
import { useSession } from 'src/sdk/session'
import { getLocalizedQuoteStatusMap } from 'src/utils/quoteStatus'
import type { MyAccountListQuotesSectionLabels } from '../quotesLabels'
import {
  pickQuoteStatusCmsLabels,
  resolveMyAccountListQuotesLabels,
} from '../quotesLabels'
import { formatFilterDate } from '../quoteFilters'

type MyAccountQuotesSelectedTagsProps = Readonly<{
  filters: {
    status?: string[]
    createdAtFrom?: string
    createdAtTo?: string
    expiresAtFrom?: string
    expiresAtTo?: string
  }
  onClearAll: () => void
  onRemoveFilter: (
    key:
      | 'status'
      | 'createdAtFrom'
      | 'createdAtTo'
      | 'expiresAtFrom'
      | 'expiresAtTo',
    value: string
  ) => void
  labels?: MyAccountListQuotesSectionLabels
}>

function formatDateRangeLabel(
  from: string | undefined,
  to: string | undefined,
  locale: string,
  labels: Required<MyAccountListQuotesSectionLabels>
) {
  if (from && to) {
    return `${formatFilterDate(from, locale)} ${labels.dateRangeSeparatorLabel} ${formatFilterDate(to, locale)}`
  }
  if (from) {
    return `${labels.dateRangeFromLabel} ${formatFilterDate(from, locale)}`
  }
  return `${labels.dateRangeToLabel} ${formatFilterDate(to!, locale)}`
}

function Tags({
  filters,
  onRemoveFilter,
  labels,
}: Pick<MyAccountQuotesSelectedTagsProps, 'filters' | 'onRemoveFilter'> & {
  labels: Required<MyAccountListQuotesSectionLabels>
}) {
  const { locale } = useSession()
  const { createdAtFrom, createdAtTo, expiresAtFrom, expiresAtTo, status } =
    filters
  const statusMap = getLocalizedQuoteStatusMap(pickQuoteStatusCmsLabels(labels))

  const createdTag = (createdAtFrom || createdAtTo) && (
    <div key="created-date-range" data-fs-list-orders-selected-tag>
      <span data-fs-list-orders-selected-tag-label>
        {`${labels.createdTagLabel}: ${formatDateRangeLabel(createdAtFrom, createdAtTo, locale, labels)}`}
      </span>
      <button
        data-fs-list-orders-selected-tag-clear
        onClick={() => onRemoveFilter('createdAtFrom', createdAtFrom ?? '')}
      >
        &times;
      </button>
    </div>
  )

  const expiresTag = (expiresAtFrom || expiresAtTo) && (
    <div key="expires-date-range" data-fs-list-orders-selected-tag>
      <span data-fs-list-orders-selected-tag-label>
        {`${labels.expiresTagLabel}: ${formatDateRangeLabel(expiresAtFrom, expiresAtTo, locale, labels)}`}
      </span>
      <button
        data-fs-list-orders-selected-tag-clear
        onClick={() => onRemoveFilter('expiresAtFrom', expiresAtFrom ?? '')}
      >
        &times;
      </button>
    </div>
  )

  const statusTags = (status || []).map((value) => (
    <div key={`status-${value}`} data-fs-list-orders-selected-tag>
      <span>{statusMap[value as keyof typeof statusMap]?.label ?? value}</span>
      <button
        data-fs-list-orders-selected-tag-clear
        onClick={() => onRemoveFilter('status', value)}
      >
        &times;
      </button>
    </div>
  ))

  return (
    <>
      {createdTag}
      {expiresTag}
      {statusTags}
    </>
  )
}

function MyAccountQuotesSelectedTags({
  filters,
  onClearAll,
  onRemoveFilter,
  labels: labelsProp,
}: MyAccountQuotesSelectedTagsProps) {
  const labels = resolveMyAccountListQuotesLabels(labelsProp)
  const hasFilters = Object.entries(filters).some(([, values]) =>
    Array.isArray(values) ? values.length > 0 : Boolean(values)
  )

  return (
    <>
      {hasFilters && (
        <div data-fs-list-orders-selected-tags>
          <Tags
            filters={filters}
            onRemoveFilter={onRemoveFilter}
            labels={labels}
          />
          <Button
            variant="tertiary"
            size="small"
            data-fs-list-orders-selected-tags-clear-all-button
            onClick={onClearAll}
          >
            {labels.clearAllLabel}
          </Button>
        </div>
      )}
    </>
  )
}

export default MyAccountQuotesSelectedTags
