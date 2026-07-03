import { Button } from '@faststore/ui'
import { useSession } from 'src/sdk/session'
import { quoteStatusMap, type QuoteStatusKey } from 'src/utils/quoteStatus'
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
}>

function formatDateRangeLabel(
  from: string | undefined,
  to: string | undefined,
  locale: string
) {
  if (from && to) {
    return `${formatFilterDate(from, locale)} to ${formatFilterDate(to, locale)}`
  }
  if (from) {
    return `from ${formatFilterDate(from, locale)}`
  }
  return `to ${formatFilterDate(to!, locale)}`
}

function Tags({
  filters,
  onRemoveFilter,
}: Pick<MyAccountQuotesSelectedTagsProps, 'filters' | 'onRemoveFilter'>) {
  const { locale } = useSession()
  const { createdAtFrom, createdAtTo, expiresAtFrom, expiresAtTo, status } =
    filters

  const createdTag = (createdAtFrom || createdAtTo) && (
    <div key="created-date-range" data-fs-list-orders-selected-tag>
      <span data-fs-list-orders-selected-tag-label>
        {`Created: ${formatDateRangeLabel(createdAtFrom, createdAtTo, locale)}`}
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
        {`Expires: ${formatDateRangeLabel(expiresAtFrom, expiresAtTo, locale)}`}
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
      <span>{quoteStatusMap[value as QuoteStatusKey]?.label ?? value}</span>
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
}: MyAccountQuotesSelectedTagsProps) {
  const hasFilters = Object.entries(filters).some(([, values]) =>
    Array.isArray(values) ? values.length > 0 : Boolean(values)
  )

  return (
    <>
      {hasFilters && (
        <div data-fs-list-orders-selected-tags>
          <Tags filters={filters} onRemoveFilter={onRemoveFilter} />
          <Button
            variant="tertiary"
            size="small"
            data-fs-list-orders-selected-tags-clear-all-button
            onClick={onClearAll}
          >
            Clear All
          </Button>
        </div>
      )}
    </>
  )
}

export default MyAccountQuotesSelectedTags
