import { Button } from '@faststore/ui'
import { useSession } from 'src/sdk/session'
import { FastStoreOrderStatusWithLabels } from 'src/utils/userOrderStatus'

type MyAccountSelectedTagsProps = {
  filters: {
    status?: string[]
    dateInitial?: string
    dateFinal?: string
  }
  onClearAll: () => void
  onRemoveFilter: (
    key: 'status' | 'dateInitial' | 'dateFinal',
    value: string
  ) => void
}

function formatShippingDate(date: string, locale: string) {
  return new Date(date).toLocaleDateString(locale, {
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
  const { dateInitial, dateFinal, status } = filters
  const formattedDateInitial = dateInitial
    ? formatShippingDate(dateInitial, locale)
    : ''
  const formattedDateFinal = dateFinal
    ? formatShippingDate(dateFinal, locale)
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

  return (
    <>
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
      (key === 'status' || key === 'dateInitial' || key === 'dateFinal') &&
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
