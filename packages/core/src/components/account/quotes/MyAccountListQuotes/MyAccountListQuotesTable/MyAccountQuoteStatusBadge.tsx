import { quoteStatusMap, type QuoteStatusKey } from 'src/utils/quoteStatus'

function MyAccountQuoteStatusBadge({ status }: { status: string }) {
  const entry = quoteStatusMap[status as QuoteStatusKey]
  return (
    <span
      data-fs-my-account-badge
      data-fs-my-account-badge-variant={entry?.variant ?? 'neutral'}
    >
      {entry?.label ?? status}
    </span>
  )
}

export default MyAccountQuoteStatusBadge
