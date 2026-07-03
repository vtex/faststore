/**
 * @vitest-environment jsdom
 */

import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import MyAccountQuoteStatusBadge from '../../../src/components/account/quotes/MyAccountListQuotes/MyAccountListQuotesTable/MyAccountQuoteStatusBadge'

describe('MyAccountQuoteStatusBadge', () => {
  it('renders the mapped label and variant for a known status', () => {
    render(<MyAccountQuoteStatusBadge status="Approved" />)

    const badge = screen.getByText('Approved')
    expect(badge.getAttribute('data-fs-my-account-badge-variant')).toBe(
      'success'
    )
  })

  it('falls back to the raw status and a neutral variant when unknown', () => {
    render(<MyAccountQuoteStatusBadge status="SomethingElse" />)

    const badge = screen.getByText('SomethingElse')
    expect(badge.getAttribute('data-fs-my-account-badge-variant')).toBe(
      'neutral'
    )
  })
})
