import { Button } from '@faststore/ui'
import { useSession } from 'src/sdk/session'
import { FastStoreOrderStatusWithLabels } from 'src/utils/userOrderStatus'

type MyAccountSelectedTagsProps = {
  filters: {
    status?: string[]
    dateInitial?: string
    dateFinal?: string
    purchaseAgentId?: string
    pendingMyApproval?: boolean
  }
  onClearAll: () => void
  onRemoveFilter: (
    key:
      | 'status'
      | 'dateInitial'
      | 'dateFinal'
      | 'purchaseAgentId'
      | 'pendingMyApproval',
    value: string | boolean
  ) => void
}

/**
 * This function formats the shipping date to a localized string. To avoid timezone issues, it parses the date string manually.
 * @param date - Example date input: "2023-10-01" (YYYY-MM-DD)
 * @param locale - The locale to format the date string, e.g., 'en-US', 'pt-BR'.
 * @returns Formatted date string in the format "MM/DD/YYYY" or "DD/MM/YYYY" depending on the locale.
 */
function formatFilterDate(date: string, locale: string) {
  // Parse the date string manually to avoid timezone issues
  const [year, month, day] = date.split('-').map(Number)

  // Create date object using local timezone (not UTC)
  const dateObj = new Date(year, month - 1, day)

  return dateObj.toLocaleDateString(locale, {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
}

function Tags({
  filters,
  onRemoveFilter,
}: Pick<MyAccountSelectedTagsProps, 'filters' | 'onRemoveFilter'>) {
  const { locale } = useSession()
  const { dateInitial, dateFinal, status, purchaseAgentId, pendingMyApproval } =
    filters

  const formattedDateInitial = dateInitial
    ? formatFilterDate(dateInitial, locale)
    : ''
  const formattedDateFinal = dateFinal
    ? formatFilterDate(dateFinal, locale)
    : ''

  const dateTag = (dateInitial || dateFinal) && (
    <div key="date-range" data-fs-list-orders-selected-tag>
      <span data-fs-list-orders-selected-tag-label>
        {(dateInitial && dateFinal
          ? `${formattedDateInitial} to ${formattedDateFinal}`
          : formattedDateInitial
            ? `from ${formattedDateInitial}`
            : `to ${formattedDateFinal}`) || ''}
      </span>
      <button
        data-fs-list-orders-selected-tag-clear
        onClick={() => {
          onRemoveFilter('dateInitial', dateInitial)
          // dateFinal is not needed as the date range is a single tag
        }}
      >
        &times;
      </button>
    </div>
  )

  const statusTags = (status || []).map((value) => (
    <div key={`status-${value}`} data-fs-list-orders-selected-tag>
      <span>
        {FastStoreOrderStatusWithLabels[
          value.toLowerCase() as keyof typeof FastStoreOrderStatusWithLabels
        ] || value}
      </span>
      <button
        data-fs-list-orders-selected-tag-clear
        onClick={() => onRemoveFilter('status', value)}
      >
        &times;
      </button>
    </div>
  ))

  const placedByTag = purchaseAgentId && (
    <div key={`placed-by-${purchaseAgentId}`} data-fs-list-orders-selected-tag>
      <span>Placed by: {purchaseAgentId}</span>
      <button
        data-fs-list-orders-selected-tag-clear
        onClick={() => onRemoveFilter('purchaseAgentId', purchaseAgentId)}
      >
        &times;
      </button>
    </div>
  )

  const pendingMyApprovalTag = pendingMyApproval && (
    <div key="pending-approval" data-fs-list-orders-selected-tag>
      <span>Pending my approval</span>
      <button
        data-fs-list-orders-selected-tag-clear
        onClick={() => onRemoveFilter('pendingMyApproval', pendingMyApproval)}
      >
        &times;
      </button>
    </div>
  )

  return (
    <>
      {pendingMyApprovalTag}
      {placedByTag}
      {dateTag}
      {statusTags}
    </>
  )
}

function MyAccountSelectedTags({
  filters,
  onClearAll,
  onRemoveFilter,
}: MyAccountSelectedTagsProps) {
  const hasFilters = Object.entries(filters).some(
    ([key, values]) =>
      (key === 'status' ||
        key === 'dateInitial' ||
        key === 'dateFinal' ||
        key === 'purchaseAgentId' ||
        key === 'pendingMyApproval') &&
      values &&
      (Array.isArray(values) ? values.length > 0 : true)
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

export default MyAccountSelectedTags
