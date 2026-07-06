/**
 * @vitest-environment jsdom
 */

import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

const mockUseSession = vi.hoisted(() => vi.fn())
vi.mock('src/sdk/session', () => ({ useSession: mockUseSession }))

import MyAccountQuotesSelectedTags from '../../../src/components/account/quotes/MyAccountListQuotes/MyAccountQuotesSelectedTags/MyAccountQuotesSelectedTags'
import { formatFilterDate } from '../../../src/components/account/quotes/MyAccountListQuotes/quoteFilters'

mockUseSession.mockReturnValue({ locale: 'en-US' })

describe('MyAccountQuotesSelectedTags', () => {
  it('renders nothing when there are no active filters', () => {
    const { container } = render(
      <MyAccountQuotesSelectedTags
        filters={{}}
        onClearAll={vi.fn()}
        onRemoveFilter={vi.fn()}
      />
    )

    expect(container.firstChild).toBeNull()
  })

  it('renders a range tag when both from and to dates are set', () => {
    render(
      <MyAccountQuotesSelectedTags
        filters={{ createdAtFrom: '2026-01-01', createdAtTo: '2026-01-31' }}
        onClearAll={vi.fn()}
        onRemoveFilter={vi.fn()}
      />
    )

    const expected = `Created: ${formatFilterDate('2026-01-01', 'en-US')} to ${formatFilterDate('2026-01-31', 'en-US')}`
    expect(screen.getByText(expected)).toBeTruthy()
  })

  it('renders an open-ended "from" tag when only the start date is set', () => {
    render(
      <MyAccountQuotesSelectedTags
        filters={{ expiresAtFrom: '2026-02-01' }}
        onClearAll={vi.fn()}
        onRemoveFilter={vi.fn()}
      />
    )

    const expected = `Expires: from ${formatFilterDate('2026-02-01', 'en-US')}`
    expect(screen.getByText(expected)).toBeTruthy()
  })

  it('renders an open-ended "to" tag when only the end date is set', () => {
    render(
      <MyAccountQuotesSelectedTags
        filters={{ expiresAtTo: '2026-02-28' }}
        onClearAll={vi.fn()}
        onRemoveFilter={vi.fn()}
      />
    )

    const expected = `Expires: to ${formatFilterDate('2026-02-28', 'en-US')}`
    expect(screen.getByText(expected)).toBeTruthy()
  })

  it('renders one tag per selected status using its mapped label', () => {
    render(
      <MyAccountQuotesSelectedTags
        filters={{ status: ['Draft', 'Approved'] }}
        onClearAll={vi.fn()}
        onRemoveFilter={vi.fn()}
      />
    )

    expect(screen.getByText('Draft')).toBeTruthy()
    expect(screen.getByText('Approved')).toBeTruthy()
  })

  it('falls back to the raw value for an unmapped status', () => {
    render(
      <MyAccountQuotesSelectedTags
        filters={{ status: ['NotAStatus'] }}
        onClearAll={vi.fn()}
        onRemoveFilter={vi.fn()}
      />
    )

    expect(screen.getByText('NotAStatus')).toBeTruthy()
  })

  it('calls onRemoveFilter with the right key/value when a tag is cleared', () => {
    const onRemoveFilter = vi.fn()
    render(
      <MyAccountQuotesSelectedTags
        filters={{ status: ['Draft'] }}
        onClearAll={vi.fn()}
        onRemoveFilter={onRemoveFilter}
      />
    )

    fireEvent.click(screen.getByText('×'))

    expect(onRemoveFilter).toHaveBeenCalledWith('status', 'Draft')
  })

  it('calls onClearAll when the Clear All button is clicked', () => {
    const onClearAll = vi.fn()
    render(
      <MyAccountQuotesSelectedTags
        filters={{ status: ['Draft'] }}
        onClearAll={onClearAll}
        onRemoveFilter={vi.fn()}
      />
    )

    fireEvent.click(screen.getByText('Clear All'))

    expect(onClearAll).toHaveBeenCalledTimes(1)
  })
})
