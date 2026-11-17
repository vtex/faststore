import { MyAccountListCards } from 'src/components/account/cards/MyAccountListCards'
import type { MyAccountListCardsSectionLabels } from 'src/components/account/cards/MyAccountListCards/myAccountListCardsLabels'
import { defaultMyAccountListCardsLabels } from 'src/components/account/cards/MyAccountListCards/myAccountListCardsLabels'
import {
  type AccountCardsPageData,
  useAccountPageData,
} from 'src/sdk/account/accountPageContext'
import Section from '../Section'

export type AccountListCardsProps = MyAccountListCardsSectionLabels

const AccountListCards = ({
  pageTitle = defaultMyAccountListCardsLabels.pageTitle,
  personalTabLabel = defaultMyAccountListCardsLabels.personalTabLabel,
  sharedTabLabel = defaultMyAccountListCardsLabels.sharedTabLabel,
  searchPlaceholder = defaultMyAccountListCardsLabels.searchPlaceholder,
  paginationOfLabel = defaultMyAccountListCardsLabels.paginationOfLabel,
  previousPageLabel = defaultMyAccountListCardsLabels.previousPageLabel,
  nextPageLabel = defaultMyAccountListCardsLabels.nextPageLabel,
  noPersonalCardsLabel = defaultMyAccountListCardsLabels.noPersonalCardsLabel,
  noSharedCardsLabel = defaultMyAccountListCardsLabels.noSharedCardsLabel,
  noResultsLabel = defaultMyAccountListCardsLabels.noResultsLabel,
  errorTitleLabel = defaultMyAccountListCardsLabels.errorTitleLabel,
  tryAgainLabel = defaultMyAccountListCardsLabels.tryAgainLabel,
  sharedCardsTooltipLabel = defaultMyAccountListCardsLabels.sharedCardsTooltipLabel,
  defaultCardLabel = defaultMyAccountListCardsLabels.defaultCardLabel,
  genericCardLabel = defaultMyAccountListCardsLabels.genericCardLabel,
}: AccountListCardsProps) => {
  const {
    personalCards,
    sharedCards,
    hasOrgAssociation,
    canViewPersonalCards,
    hasError,
  } = useAccountPageData<AccountCardsPageData>()

  return (
    <Section className="section-account-list-cards">
      <MyAccountListCards
        personalCards={personalCards ?? []}
        sharedCards={sharedCards ?? []}
        hasOrgAssociation={hasOrgAssociation}
        canViewPersonalCards={canViewPersonalCards}
        hasError={hasError}
        labels={{
          pageTitle,
          personalTabLabel,
          sharedTabLabel,
          searchPlaceholder,
          paginationOfLabel,
          previousPageLabel,
          nextPageLabel,
          noPersonalCardsLabel,
          noSharedCardsLabel,
          noResultsLabel,
          errorTitleLabel,
          tryAgainLabel,
          sharedCardsTooltipLabel,
          defaultCardLabel,
          genericCardLabel,
        }}
      />
    </Section>
  )
}

AccountListCards.$componentKey = 'AccountListCards'

export default AccountListCards
