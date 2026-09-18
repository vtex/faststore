import type { QuoteStatusCmsLabels } from 'src/utils/quoteStatus'
import { getLocalizedQuoteStatusMap } from 'src/utils/quoteStatus'

function MyAccountQuoteStatusBadge({
  status,
  statusCmsLabels,
}: Readonly<{
  status: string
  statusCmsLabels?: QuoteStatusCmsLabels
}>) {
  const statusMap = getLocalizedQuoteStatusMap(statusCmsLabels)
  const entry = statusMap[status as keyof typeof statusMap]
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
