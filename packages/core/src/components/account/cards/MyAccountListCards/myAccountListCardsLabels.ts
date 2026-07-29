export type MyAccountListCardsSectionLabels = {
  pageTitle?: string
  personalTabLabel?: string
  sharedTabLabel?: string
  searchPlaceholder?: string
  paginationOfLabel?: string
  previousPageLabel?: string
  nextPageLabel?: string
  noPersonalCardsLabel?: string
  noSharedCardsLabel?: string
  noResultsLabel?: string
  errorTitleLabel?: string
  tryAgainLabel?: string
  sharedCardsTooltipLabel?: string
  defaultCardLabel?: string
}

export const defaultMyAccountListCardsLabels: Required<MyAccountListCardsSectionLabels> =
  {
    pageTitle: 'Cards',
    personalTabLabel: 'Personal',
    sharedTabLabel: 'Shared',
    searchPlaceholder: 'Search',
    paginationOfLabel: 'of',
    previousPageLabel: 'Previous Page',
    nextPageLabel: 'Next Page',
    noPersonalCardsLabel: "You don't have any cards",
    noSharedCardsLabel: 'Your organization has no shared cards',
    noResultsLabel: 'No results found',
    errorTitleLabel: "We couldn't load your cards",
    tryAgainLabel: 'Try again',
    sharedCardsTooltipLabel:
      'These cards are shared by the organization you belong to. Changes can only be made by the administrator.',
    defaultCardLabel: 'Default',
  }

export function resolveMyAccountListCardsLabels(
  labels?: MyAccountListCardsSectionLabels
): Required<MyAccountListCardsSectionLabels> {
  return { ...defaultMyAccountListCardsLabels, ...labels }
}
