import type { QuoteStatusCmsLabels } from 'src/utils/quoteStatus'
import { pickQuoteStatusCmsLabels as pickQuoteStatusCmsLabelsFromData } from 'src/utils/quoteStatus'

export type MyAccountListQuotesSectionLabels = {
  pageTitle?: string
  searchPlaceholder?: string
  openFiltersAriaLabel?: string
  filtersLabel?: string
  clearAllLabel?: string
  viewResultsLabel?: string
  noResultsLabel?: string
  noQuotesLabel?: string
  statusFacetLabel?: string
  createdAtFacetLabel?: string
  expiresAtFacetLabel?: string
  fromLabel?: string
  toLabel?: string
  invalidDateRangeLabel?: string
  paginationOfLabel?: string
  previousPageLabel?: string
  nextPageLabel?: string
  createdTagLabel?: string
  expiresTagLabel?: string
  /** Lowercase connector used in an open-ended range, e.g. "{fromLabel} Jan 1". */
  dateRangeFromLabel?: string
  /** Lowercase connector used in an open-ended range, e.g. "{dateRangeToLabel} Jan 31". */
  dateRangeToLabel?: string
  /** Connector used between two dates, e.g. "Jan 1 {dateRangeSeparatorLabel} Jan 31". */
  dateRangeSeparatorLabel?: string
  createdByLabel?: string
  creationDateLabel?: string
  expiresOnLabel?: string
  totalLabel?: string
  hourLabel?: string
  hoursLabel?: string
  dayLabel?: string
  daysLabel?: string
  weekLabel?: string
  weeksLabel?: string
  monthLabel?: string
  monthsLabel?: string
  /** Suffix appended to the relative expiry hint, e.g. "3 hours {leftSuffixLabel}". */
  leftSuffixLabel?: string
  draftStatus?: string
  requestedStatus?: string
  inReviewStatus?: string
  revisedStatus?: string
  approvedStatus?: string
  declinedStatus?: string
  expiredStatus?: string
  convertedStatus?: string
  convertedToOrderStatus?: string
}

export const defaultMyAccountListQuotesLabels: Required<MyAccountListQuotesSectionLabels> =
  {
    pageTitle: 'Quotes',
    searchPlaceholder: 'Search',
    openFiltersAriaLabel: 'Open Filters',
    filtersLabel: 'Filters',
    clearAllLabel: 'Clear All',
    viewResultsLabel: 'View Results',
    noResultsLabel: 'No results found',
    noQuotesLabel: "You don't have any quotes",
    statusFacetLabel: 'Status',
    createdAtFacetLabel: 'Created Date',
    expiresAtFacetLabel: 'Expiry Date',
    fromLabel: 'From',
    toLabel: 'To',
    invalidDateRangeLabel: 'Invalid date range',
    paginationOfLabel: 'of',
    previousPageLabel: 'Previous Page',
    nextPageLabel: 'Next Page',
    createdTagLabel: 'Created',
    expiresTagLabel: 'Expires',
    dateRangeFromLabel: 'from',
    dateRangeToLabel: 'to',
    dateRangeSeparatorLabel: 'to',
    createdByLabel: 'Created by',
    creationDateLabel: 'Creation date',
    expiresOnLabel: 'Expires on',
    totalLabel: 'Total',
    hourLabel: 'hour',
    hoursLabel: 'hours',
    dayLabel: 'day',
    daysLabel: 'days',
    weekLabel: 'week',
    weeksLabel: 'weeks',
    monthLabel: 'month',
    monthsLabel: 'months',
    leftSuffixLabel: 'left',
    draftStatus: 'Draft',
    requestedStatus: 'Requested',
    inReviewStatus: 'In Review',
    revisedStatus: 'Revised',
    approvedStatus: 'Approved',
    declinedStatus: 'Declined',
    expiredStatus: 'Expired',
    convertedStatus: 'Converted',
    convertedToOrderStatus: 'Converted to Order',
  }

const STATUS_LABEL_KEYS = [
  'draftStatus',
  'requestedStatus',
  'inReviewStatus',
  'revisedStatus',
  'approvedStatus',
  'declinedStatus',
  'expiredStatus',
  'convertedStatus',
  'convertedToOrderStatus',
] as const satisfies readonly (keyof MyAccountListQuotesSectionLabels)[]

export function resolveMyAccountListQuotesLabels(
  labels?: MyAccountListQuotesSectionLabels
): Required<MyAccountListQuotesSectionLabels> {
  return { ...defaultMyAccountListQuotesLabels, ...labels }
}

export function pickQuoteStatusCmsLabels(
  labels?: MyAccountListQuotesSectionLabels
): QuoteStatusCmsLabels | undefined {
  return pickQuoteStatusCmsLabelsFromData(
    labels as Record<string, unknown> | undefined
  )
}

/** Ordered list of status keys, matching `quoteStatusMap`'s iteration order, for building CMS-aware facet values. */
export function getStatusFacetLabels(
  labels: Required<MyAccountListQuotesSectionLabels>
): string[] {
  return STATUS_LABEL_KEYS.map((key) => labels[key])
}

/**
 * Formats a relative expiry hint (e.g. "3 hours left") using CMS-configurable
 * unit words and suffix. `count` singular/plural selection mirrors the
 * original hardcoded implementation.
 */
export function formatRelativeExpiryLabel(
  count: number,
  unit: 'hour' | 'day' | 'week' | 'month',
  labels: Required<MyAccountListQuotesSectionLabels>
): string {
  const unitLabels: Record<typeof unit, { singular: string; plural: string }> =
    {
      hour: { singular: labels.hourLabel, plural: labels.hoursLabel },
      day: { singular: labels.dayLabel, plural: labels.daysLabel },
      week: { singular: labels.weekLabel, plural: labels.weeksLabel },
      month: { singular: labels.monthLabel, plural: labels.monthsLabel },
    }

  const unitLabel =
    count === 1 ? unitLabels[unit].singular : unitLabels[unit].plural

  return `${count} ${unitLabel} ${labels.leftSuffixLabel}`
}
