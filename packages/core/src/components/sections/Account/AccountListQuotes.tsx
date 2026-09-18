import { MyAccountListQuotes } from 'src/components/account/quotes/MyAccountListQuotes'
import type { MyAccountListQuotesSectionLabels } from 'src/components/account/quotes/MyAccountListQuotes/quotesLabels'
import { defaultMyAccountListQuotesLabels } from 'src/components/account/quotes/MyAccountListQuotes/quotesLabels'
import {
  type AccountQuotesPageData,
  useAccountPageData,
} from 'src/sdk/account/accountPageContext'
import Section from '../Section'

export type AccountListQuotesProps = MyAccountListQuotesSectionLabels

const AccountListQuotes = ({
  pageTitle = defaultMyAccountListQuotesLabels.pageTitle,
  searchPlaceholder = defaultMyAccountListQuotesLabels.searchPlaceholder,
  openFiltersAriaLabel = defaultMyAccountListQuotesLabels.openFiltersAriaLabel,
  filtersLabel = defaultMyAccountListQuotesLabels.filtersLabel,
  clearAllLabel = defaultMyAccountListQuotesLabels.clearAllLabel,
  viewResultsLabel = defaultMyAccountListQuotesLabels.viewResultsLabel,
  noResultsLabel = defaultMyAccountListQuotesLabels.noResultsLabel,
  noQuotesLabel = defaultMyAccountListQuotesLabels.noQuotesLabel,
  statusFacetLabel = defaultMyAccountListQuotesLabels.statusFacetLabel,
  createdAtFacetLabel = defaultMyAccountListQuotesLabels.createdAtFacetLabel,
  expiresAtFacetLabel = defaultMyAccountListQuotesLabels.expiresAtFacetLabel,
  fromLabel = defaultMyAccountListQuotesLabels.fromLabel,
  toLabel = defaultMyAccountListQuotesLabels.toLabel,
  invalidDateRangeLabel = defaultMyAccountListQuotesLabels.invalidDateRangeLabel,
  paginationOfLabel = defaultMyAccountListQuotesLabels.paginationOfLabel,
  previousPageLabel = defaultMyAccountListQuotesLabels.previousPageLabel,
  nextPageLabel = defaultMyAccountListQuotesLabels.nextPageLabel,
  createdTagLabel = defaultMyAccountListQuotesLabels.createdTagLabel,
  expiresTagLabel = defaultMyAccountListQuotesLabels.expiresTagLabel,
  dateRangeFromLabel = defaultMyAccountListQuotesLabels.dateRangeFromLabel,
  dateRangeToLabel = defaultMyAccountListQuotesLabels.dateRangeToLabel,
  dateRangeSeparatorLabel = defaultMyAccountListQuotesLabels.dateRangeSeparatorLabel,
  createdByLabel = defaultMyAccountListQuotesLabels.createdByLabel,
  creationDateLabel = defaultMyAccountListQuotesLabels.creationDateLabel,
  expiresOnLabel = defaultMyAccountListQuotesLabels.expiresOnLabel,
  totalLabel = defaultMyAccountListQuotesLabels.totalLabel,
  hourLabel = defaultMyAccountListQuotesLabels.hourLabel,
  hoursLabel = defaultMyAccountListQuotesLabels.hoursLabel,
  dayLabel = defaultMyAccountListQuotesLabels.dayLabel,
  daysLabel = defaultMyAccountListQuotesLabels.daysLabel,
  weekLabel = defaultMyAccountListQuotesLabels.weekLabel,
  weeksLabel = defaultMyAccountListQuotesLabels.weeksLabel,
  monthLabel = defaultMyAccountListQuotesLabels.monthLabel,
  monthsLabel = defaultMyAccountListQuotesLabels.monthsLabel,
  leftSuffixLabel = defaultMyAccountListQuotesLabels.leftSuffixLabel,
  draftStatus = defaultMyAccountListQuotesLabels.draftStatus,
  requestedStatus = defaultMyAccountListQuotesLabels.requestedStatus,
  inReviewStatus = defaultMyAccountListQuotesLabels.inReviewStatus,
  revisedStatus = defaultMyAccountListQuotesLabels.revisedStatus,
  approvedStatus = defaultMyAccountListQuotesLabels.approvedStatus,
  declinedStatus = defaultMyAccountListQuotesLabels.declinedStatus,
  expiredStatus = defaultMyAccountListQuotesLabels.expiredStatus,
  convertedStatus = defaultMyAccountListQuotesLabels.convertedStatus,
  convertedToOrderStatus = defaultMyAccountListQuotesLabels.convertedToOrderStatus,
}: AccountListQuotesProps) => {
  const { listQuotes, total, perPage, filters } =
    useAccountPageData<AccountQuotesPageData>()

  return (
    <Section className="section-account-list-quotes">
      <MyAccountListQuotes
        listQuotes={listQuotes}
        total={total}
        perPage={perPage}
        filters={filters}
        labels={{
          pageTitle,
          searchPlaceholder,
          openFiltersAriaLabel,
          filtersLabel,
          clearAllLabel,
          viewResultsLabel,
          noResultsLabel,
          noQuotesLabel,
          statusFacetLabel,
          createdAtFacetLabel,
          expiresAtFacetLabel,
          fromLabel,
          toLabel,
          invalidDateRangeLabel,
          paginationOfLabel,
          previousPageLabel,
          nextPageLabel,
          createdTagLabel,
          expiresTagLabel,
          dateRangeFromLabel,
          dateRangeToLabel,
          dateRangeSeparatorLabel,
          createdByLabel,
          creationDateLabel,
          expiresOnLabel,
          totalLabel,
          hourLabel,
          hoursLabel,
          dayLabel,
          daysLabel,
          weekLabel,
          weeksLabel,
          monthLabel,
          monthsLabel,
          leftSuffixLabel,
          draftStatus,
          requestedStatus,
          inReviewStatus,
          revisedStatus,
          approvedStatus,
          declinedStatus,
          expiredStatus,
          convertedStatus,
          convertedToOrderStatus,
        }}
      />
    </Section>
  )
}

AccountListQuotes.$componentKey = 'AccountListQuotes'

export default AccountListQuotes
