import { describe, expect, it } from 'vitest'

import {
  type DelegationRow,
  filterAvailableCandidates,
  formatDelegationDate,
  getUserDisplayName,
  isActiveOrScheduled,
  toISODate,
  validatePeriod,
} from '../../../../src/components/account/UserDetails/delegation/delegationUtils'

const today = '2026-11-10'

const row = (overrides: Partial<DelegationRow> = {}): DelegationRow => ({
  id: 'del-1',
  granteeUserId: 'user-1',
  startDate: '2026-11-01',
  endDate: '2026-12-01',
  ...overrides,
})

describe('toISODate', () => {
  it('formats the local calendar day with zero padding', () => {
    expect(toISODate(new Date(2026, 0, 5))).toBe('2026-01-05')
    expect(toISODate(new Date(2026, 10, 10))).toBe('2026-11-10')
  })
})

describe('validatePeriod', () => {
  it('requires a start date', () => {
    expect(validatePeriod({ startDate: '', endDate: '', today })).toBe(
      'startDateRequired'
    )
  })

  it('accepts an open-ended period', () => {
    expect(validatePeriod({ startDate: today, endDate: '', today })).toBeNull()
  })

  it('rejects an end date earlier than the start date', () => {
    expect(
      validatePeriod({ startDate: '2026-11-20', endDate: '2026-11-19', today })
    ).toBe('endBeforeStart')
  })

  it('accepts a single-day period (end equal to start)', () => {
    expect(
      validatePeriod({ startDate: '2026-11-20', endDate: '2026-11-20', today })
    ).toBeNull()
  })

  it('rejects an end date before today, but allows ending today', () => {
    expect(
      validatePeriod({ startDate: '2026-11-01', endDate: '2026-11-09', today })
    ).toBe('endInPast')
    expect(
      validatePeriod({ startDate: '2026-11-01', endDate: '2026-11-10', today })
    ).toBeNull()
  })

  it('reports end before start before end in the past', () => {
    expect(
      validatePeriod({ startDate: '2026-11-08', endDate: '2026-11-07', today })
    ).toBe('endBeforeStart')
  })
})

describe('isActiveOrScheduled', () => {
  it('keeps open-ended delegations', () => {
    expect(isActiveOrScheduled(row({ endDate: null }), today)).toBe(true)
  })

  it('keeps a delegation that ends today or later and drops one that ended', () => {
    expect(isActiveOrScheduled(row({ endDate: '2026-11-10' }), today)).toBe(
      true
    )
    expect(isActiveOrScheduled(row({ endDate: '2026-11-09' }), today)).toBe(
      false
    )
  })
})

describe('filterAvailableCandidates', () => {
  const candidates = [
    { userId: 'user-1', username: 'ana' },
    { userId: 'user-2', username: 'bob' },
    { userId: 'user-3', username: 'cy' },
  ]

  it('removes users that already have an active or scheduled delegation', () => {
    const delegations = [
      row({ granteeUserId: 'user-1' }),
      row({ id: 'del-2', granteeUserId: 'user-2', endDate: null }),
    ]

    expect(filterAvailableCandidates(candidates, delegations, today)).toEqual([
      { userId: 'user-3', username: 'cy' },
    ])
  })

  it('offers again a user whose only delegation already expired', () => {
    const delegations = [
      row({ granteeUserId: 'user-1', endDate: '2026-11-09' }),
    ]

    expect(
      filterAvailableCandidates(candidates, delegations, today).map(
        (candidate) => candidate.userId
      )
    ).toEqual(['user-1', 'user-2', 'user-3'])
  })

  it('returns everyone when there are no delegations', () => {
    expect(filterAvailableCandidates(candidates, [], today)).toEqual(candidates)
  })
})

describe('getUserDisplayName', () => {
  it('prefers the username, then the email, then a dash', () => {
    expect(getUserDisplayName({ username: 'ana', email: 'a@x.com' })).toBe(
      'ana'
    )
    expect(getUserDisplayName({ granteeUsername: 'bob' })).toBe('bob')
    expect(getUserDisplayName({ email: 'a@x.com' })).toBe('a@x.com')
    expect(getUserDisplayName({ granteeEmail: 'b@x.com' })).toBe('b@x.com')
    expect(getUserDisplayName({ username: null, email: null })).toBe('–')
  })
})

describe('formatDelegationDate', () => {
  it('renders the indefinite label when there is no date', () => {
    expect(formatDelegationDate(null, 'en-US', 'Indefinite')).toBe('Indefinite')
    expect(formatDelegationDate(undefined, 'en-US', 'Indefinite')).toBe(
      'Indefinite'
    )
    expect(formatDelegationDate('', 'en-US', 'Indefinite')).toBe('Indefinite')
  })

  it('formats the calendar day in the locale, without timezone shifts', () => {
    expect(formatDelegationDate('2026-12-01', 'en-US', 'Indefinite')).toBe(
      'Dec 1, 2026'
    )
    expect(formatDelegationDate('2026-01-31', 'en-US', 'Indefinite')).toBe(
      'Jan 31, 2026'
    )
  })

  it('returns the raw value when it is not a valid day', () => {
    expect(formatDelegationDate('soon', 'en-US', 'Indefinite')).toBe('soon')
  })
})
