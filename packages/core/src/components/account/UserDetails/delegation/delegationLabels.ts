export type DelegationLabels = {
  detailsTabLabel?: string
  delegationTabLabel?: string
  /** `{name}` is replaced by the buyer's name, highlighted. */
  delegationSectionTitle?: string
  /** `{name}` is replaced by the buyer's name, highlighted. */
  actingForSectionTitle?: string
  addLabel?: string
  userColumnLabel?: string
  startDateColumnLabel?: string
  endDateColumnLabel?: string
  indefiniteLabel?: string
  moreOptionsAria?: string
  editLabel?: string
  removeLabel?: string
  emptyMessage?: string
  loadErrorMessage?: string
  retryLabel?: string
  addDrawerTitle?: string
  editDrawerTitle?: string
  /** `{name}` is replaced by the buyer's name. */
  addDrawerDescription?: string
  delegateFieldLabel?: string
  delegatePlaceholder?: string
  periodLabel?: string
  startDateFieldLabel?: string
  endDateFieldLabel?: string
  endDateHint?: string
  continueLabel?: string
  backLabel?: string
  cancelLabel?: string
  saveLabel?: string
  confirmTitle?: string
  /** `{delegate}`, `{name}`, `{startDate}` and `{endDate}` are replaced. */
  confirmIntro?: string
  /** Same as `confirmIntro`, for a delegation without end date. */
  confirmIntroNoEndDate?: string
  /** `{delegate}` is replaced. */
  confirmWhileActive?: string
  confirmCapabilitySignIn?: string
  confirmCapabilityData?: string
  confirmCapabilityPermissions?: string
  /** `{delegate}` and `{name}` are replaced. Shown when the Delegate has fewer roles. */
  confirmFewerRolesNote?: string
  confirmRevokeNote?: string
  confirmLabel?: string
  /** Shown on the confirm button while the request is in flight. */
  confirmingLabel?: string
  /** Shown on the save button while the request is in flight. */
  savingLabel?: string
  delegateRequiredError?: string
  startDateRequiredError?: string
  endBeforeStartError?: string
  endInPastError?: string
  noCandidatesMessage?: string
  removeSelectedAria?: string
  addedToast?: string
  updatedToast?: string
  removedToast?: string
  errorToastTitle?: string
  errorToastMessage?: string
  closeAria?: string
}

export const defaultDelegationLabels: Required<DelegationLabels> = {
  detailsTabLabel: 'Details',
  delegationTabLabel: 'Delegation',
  delegationSectionTitle: 'Users who can act on behalf of {name}',
  actingForSectionTitle: 'Users {name} can act on behalf of',
  addLabel: 'Add',
  userColumnLabel: 'User',
  startDateColumnLabel: 'Start date',
  endDateColumnLabel: 'End date',
  indefiniteLabel: 'Indefinite',
  moreOptionsAria: 'More options',
  editLabel: 'Edit',
  removeLabel: 'Remove',
  emptyMessage: 'No users added',
  loadErrorMessage: 'We could not load your delegations.',
  retryLabel: 'Try again',
  addDrawerTitle: 'Add delegate',
  editDrawerTitle: 'Edit delegate',
  addDrawerDescription:
    'Choose someone to act on behalf of {name} for a set period, with full access to their permissions and content.',
  delegateFieldLabel: 'Select user',
  delegatePlaceholder: 'Search users',
  periodLabel: 'Period',
  startDateFieldLabel: 'Start date',
  endDateFieldLabel: 'End date',
  endDateHint: 'Leave the end date empty to make this delegation indefinite',
  continueLabel: 'Continue',
  backLabel: 'Back',
  cancelLabel: 'Cancel',
  saveLabel: 'Save',
  confirmTitle: 'Confirm access',
  confirmIntro:
    '{delegate} will be able to act on behalf of {name} from {startDate} to {endDate}.',
  confirmIntroNoEndDate:
    '{delegate} will be able to act on behalf of {name} from {startDate}, with no end date.',
  confirmWhileActive: 'While active, {delegate} can:',
  confirmCapabilitySignIn: 'Sign in and act as {name}',
  confirmCapabilityData: 'Access all their content, orders, and data',
  confirmCapabilityPermissions: 'Use all their roles and permissions',
  confirmFewerRolesNote:
    '{delegate} has fewer roles than {name}, so this grants access beyond their usual permissions.',
  confirmRevokeNote: 'You can revoke this access at any time.',
  confirmLabel: 'Confirm',
  confirmingLabel: 'Confirming...',
  savingLabel: 'Saving...',
  delegateRequiredError: 'Select a user.',
  startDateRequiredError: 'Select a start date.',
  endBeforeStartError: 'The end date cannot be earlier than the start date.',
  endInPastError: 'The end date cannot be in the past.',
  noCandidatesMessage: 'There are no users available to be added.',
  removeSelectedAria: 'Remove selected user',
  addedToast: 'Delegate added successfully',
  updatedToast: 'Delegation updated successfully',
  removedToast: 'Delegate removed successfully',
  errorToastTitle: 'Something went wrong',
  errorToastMessage: 'We could not complete the action. Please try again.',
  closeAria: 'Close',
}

export function resolveDelegationLabels(
  labels?: DelegationLabels
): Required<DelegationLabels> {
  const resolved = { ...defaultDelegationLabels }

  for (const key of Object.keys(defaultDelegationLabels) as Array<
    keyof DelegationLabels
  >) {
    const value = labels?.[key]

    // Blank labels (e.g. an emptied CMS field) fall back to the default text.
    if (typeof value === 'string' && value.trim() !== '') {
      resolved[key] = value
    }
  }

  return resolved
}

/**
 * Replaces `{token}` placeholders in a label. Missing tokens are kept as
 * written so a typo in a CMS label stays visible instead of vanishing.
 */
export function fillLabel(template: string, values: Record<string, string>) {
  return template.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in values ? values[key] : match
  )
}
