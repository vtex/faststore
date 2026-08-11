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
