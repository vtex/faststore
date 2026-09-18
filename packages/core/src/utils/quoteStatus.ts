export type QuoteStatusKey =
  | 'Draft'
  | 'Requested'
  | 'InReview'
  | 'Reviewed'
  | 'Approved'
  | 'Declined'
  | 'Expired'
  | 'ConvertedToCart'
  | 'ConvertedToOrder'

export type QuoteStatusMapValue = {
  variant: 'neutral' | 'warning' | 'info' | 'success' | 'danger'
  label: string
}

export const quoteStatusMap: Record<QuoteStatusKey, QuoteStatusMapValue> = {
  Draft: { variant: 'neutral', label: 'Draft' },
  Requested: { variant: 'warning', label: 'Requested' },
  InReview: { variant: 'warning', label: 'In Review' },
  Reviewed: { variant: 'info', label: 'Revised' },
  Approved: { variant: 'success', label: 'Approved' },
  Declined: { variant: 'danger', label: 'Declined' },
  Expired: { variant: 'neutral', label: 'Expired' },
  ConvertedToCart: { variant: 'success', label: 'Converted' },
  ConvertedToOrder: { variant: 'success', label: 'Converted to Order' },
}

/** CMS-configurable overrides for each quote status label, keyed like the other My Account CMS label sets. */
export type QuoteStatusCmsLabels = Partial<{
  draftStatus: string
  requestedStatus: string
  inReviewStatus: string
  revisedStatus: string
  approvedStatus: string
  declinedStatus: string
  expiredStatus: string
  convertedStatus: string
  convertedToOrderStatus: string
}>

const QUOTE_STATUS_CMS_LABEL_KEYS = [
  'draftStatus',
  'requestedStatus',
  'inReviewStatus',
  'revisedStatus',
  'approvedStatus',
  'declinedStatus',
  'expiredStatus',
  'convertedStatus',
  'convertedToOrderStatus',
] as const satisfies readonly (keyof QuoteStatusCmsLabels)[]

const CMS_LABEL_TO_STATUS_KEY: Record<
  keyof Required<QuoteStatusCmsLabels>,
  QuoteStatusKey
> = {
  draftStatus: 'Draft',
  requestedStatus: 'Requested',
  inReviewStatus: 'InReview',
  revisedStatus: 'Reviewed',
  approvedStatus: 'Approved',
  declinedStatus: 'Declined',
  expiredStatus: 'Expired',
  convertedStatus: 'ConvertedToCart',
  convertedToOrderStatus: 'ConvertedToOrder',
}

export function pickQuoteStatusCmsLabels(
  data?: Record<string, unknown>
): QuoteStatusCmsLabels | undefined {
  if (!data) {
    return undefined
  }

  const labels: QuoteStatusCmsLabels = {}
  let hasAny = false

  for (const key of QUOTE_STATUS_CMS_LABEL_KEYS) {
    const value = data[key]
    if (typeof value === 'string' && value.trim().length > 0) {
      labels[key] = value
      hasAny = true
    }
  }

  return hasAny ? labels : undefined
}

export function getLocalizedQuoteStatusMap(
  cmsLabels?: QuoteStatusCmsLabels
): Record<QuoteStatusKey, QuoteStatusMapValue> {
  if (!cmsLabels) {
    return quoteStatusMap
  }

  const localizedMap = { ...quoteStatusMap }

  for (const key of QUOTE_STATUS_CMS_LABEL_KEYS) {
    const label = cmsLabels[key]
    if (typeof label === 'string' && label.trim().length > 0) {
      const statusKey = CMS_LABEL_TO_STATUS_KEY[key]
      localizedMap[statusKey] = { ...localizedMap[statusKey], label }
    }
  }

  return localizedMap
}

export function getQuoteStatusLabel({
  status,
  cmsLabels,
}: {
  status: string
  cmsLabels?: QuoteStatusCmsLabels
}): string | undefined {
  const localizedMap = getLocalizedQuoteStatusMap(cmsLabels)
  return localizedMap[status as QuoteStatusKey]?.label
}
