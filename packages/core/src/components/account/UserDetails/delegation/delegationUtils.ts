export type DelegationRow = {
  id: string
  granteeUserId: string
  granteeUsername?: string | null
  granteeEmail?: string | null
  startDate: string
  endDate?: string | null
}

export type DelegateCandidate = {
  userId: string
  username?: string | null
  email?: string | null
}

export type PeriodError =
  | 'startDateRequired'
  | 'endBeforeStart'
  | 'endInPast'
  | null

const pad = (value: number) => String(value).padStart(2, '0')

/** Local calendar day as `YYYY-MM-DD`, the format the delegations API uses. */
export const toISODate = (date: Date) =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`

/**
 * Validates the period of a delegation. An empty `endDate` means indefinite.
 * `endInPast` is only reported when the end date is a day before `today`, so a
 * delegation can end today.
 */
export const validatePeriod = ({
  startDate,
  endDate,
  today,
}: {
  startDate: string
  endDate: string
  today: string
}): PeriodError => {
  if (!startDate) {
    return 'startDateRequired'
  }

  if (!endDate) {
    return null
  }

  if (endDate < startDate) {
    return 'endBeforeStart'
  }

  if (endDate < today) {
    return 'endInPast'
  }

  return null
}

/** A delegation is still relevant while it is open-ended or ends today or later. */
export const isActiveOrScheduled = (delegation: DelegationRow, today: string) =>
  !delegation.endDate || delegation.endDate >= today

/**
 * Candidates the buyer can still add: nobody who already has an active or
 * scheduled delegation in the list is offered again (one entry per user).
 */
export const filterAvailableCandidates = (
  candidates: DelegateCandidate[],
  delegations: DelegationRow[],
  today: string
) => {
  const taken = new Set(
    delegations
      .filter((delegation) => isActiveOrScheduled(delegation, today))
      .map((delegation) => delegation.granteeUserId)
  )

  return candidates.filter((candidate) => !taken.has(candidate.userId))
}

export const getUserDisplayName = (user: {
  username?: string | null
  email?: string | null
  granteeUsername?: string | null
  granteeEmail?: string | null
}) =>
  user.username ??
  user.granteeUsername ??
  user.email ??
  user.granteeEmail ??
  '–'

/** Formats a `YYYY-MM-DD` date in the given locale without timezone shifts. */
export const formatDelegationDate = (
  date: string | null | undefined,
  locale: string,
  indefiniteLabel: string
) => {
  if (!date) {
    return indefiniteLabel
  }

  const [year, month, day] = date.split('-').map(Number)

  if (!year || !month || !day) {
    return date
  }

  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(Date.UTC(year, month - 1, day)))
}
