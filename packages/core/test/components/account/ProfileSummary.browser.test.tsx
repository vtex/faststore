/**
 * @vitest-environment jsdom
 */

import '@testing-library/jest-dom/vitest'
import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const mockUseSession = vi.hoisted(() => vi.fn())

vi.mock('src/sdk/session', () => ({ useSession: mockUseSession }))
vi.mock('src/sdk/account/accountPageContext', () => ({
  useAccountNavigationLabels: () => undefined,
}))

import { ProfileSummary } from '../../../src/components/account/Drawer/ProfileSummary/ProfileSummary'

const person = { name: 'Jane Buyer', email: 'jane@example.com' }

describe('ProfileSummary', () => {
  beforeEach(() => mockUseSession.mockReset())

  it('links to the Organization Account in a regular session', () => {
    mockUseSession.mockReturnValue({ b2b: { unitId: 'unit-1' } })
    render(<ProfileSummary orgName="Acme" person={person} showManageLink />)

    expect(screen.getByRole('link', { name: /manage/i })).toHaveAttribute(
      'href',
      '/pvt/organization-account/org-unit/unit-1'
    )
  })

  it('has no link to the Organization Account while impersonating', () => {
    mockUseSession.mockReturnValue({
      b2b: { unitId: 'unit-1', actorId: 'delegate-1' },
    })
    render(<ProfileSummary orgName="Acme" person={person} showManageLink />)

    expect(screen.queryByRole('link', { name: /manage/i })).toBeNull()
  })
})
