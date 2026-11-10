/**
 * @vitest-environment jsdom
 */

import '@testing-library/jest-dom/vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

const mockUseSession = vi.hoisted(() => vi.fn())

vi.mock('src/sdk/session', () => ({ useSession: mockUseSession }))

vi.mock(
  '../../../../src/components/account/UserDetails/delegation/DelegationTab',
  () => ({
    default: ({
      labels,
      userName,
    }: { labels?: { addLabel?: string }; userName?: string }) => (
      <div data-testid="delegation-tab" data-user-name={userName}>
        {labels?.addLabel ?? 'default'}
      </div>
    ),
  })
)

import UserDetails from '../../../../src/components/account/UserDetails/UserDetails'

const userDetails = {
  username: 'dgreen',
  name: 'Donald Green',
  email: 'd.green@stellar.com',
  phone: '',
  role: ['Buyer'],
  orgUnit: 'Operations',
}

describe('UserDetails tabs', () => {
  afterEach(() => {
    cleanup()
    vi.clearAllMocks()
  })

  it('shows only the details when the user does not belong to an organization unit', () => {
    mockUseSession.mockReturnValue({ b2b: null })

    render(<UserDetails userDetails={userDetails} />)

    expect(screen.queryByRole('tablist')).not.toBeInTheDocument()
    expect(screen.getByText('Donald Green')).toBeVisible()
    expect(screen.queryByTestId('delegation-tab')).not.toBeInTheDocument()
  })

  it('shows the Details and Delegation tabs for organization members, Details first', () => {
    mockUseSession.mockReturnValue({ b2b: { unitId: 'unit-1' } })

    render(<UserDetails userDetails={userDetails} />)

    const tabs = screen.getAllByRole('tab')

    expect(tabs.map((tab) => tab.textContent)).toEqual([
      'Details',
      'Delegation',
    ])
    expect(tabs[0]).toHaveAttribute('aria-selected', 'true')
    expect(tabs[1]).toHaveAttribute('aria-selected', 'false')
    expect(screen.getByText('Donald Green')).toBeVisible()
    expect(screen.queryByTestId('delegation-tab')).not.toBeInTheDocument()
  })

  it('switches to the delegation tab and back', () => {
    mockUseSession.mockReturnValue({ b2b: { unitId: 'unit-1' } })

    render(<UserDetails userDetails={userDetails} />)

    fireEvent.click(screen.getByRole('tab', { name: 'Delegation' }))

    expect(screen.getByTestId('delegation-tab')).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: 'Delegation' })).toHaveAttribute(
      'aria-selected',
      'true'
    )
    expect(screen.getByText('Donald Green')).not.toBeVisible()

    fireEvent.click(screen.getByRole('tab', { name: 'Details' }))

    expect(screen.queryByTestId('delegation-tab')).not.toBeInTheDocument()
    expect(screen.getByText('Donald Green')).toBeVisible()
  })

  it('uses CMS tab labels and passes the delegation labels down', () => {
    mockUseSession.mockReturnValue({ b2b: { unitId: 'unit-1' } })

    render(
      <UserDetails
        userDetails={userDetails}
        delegationLabels={{
          delegationTabLabel: 'Proxy users',
          addLabel: 'Invite',
        }}
      />
    )

    fireEvent.click(screen.getByRole('tab', { name: 'Proxy users' }))

    expect(screen.getByTestId('delegation-tab')).toHaveTextContent('Invite')
  })

  describe('name shown in the delegation tab', () => {
    const open = (details: Partial<typeof userDetails>) => {
      mockUseSession.mockReturnValue({ b2b: { unitId: 'unit-1' } })

      render(<UserDetails userDetails={{ ...userDetails, ...details }} />)
      fireEvent.click(screen.getByRole('tab', { name: 'Delegation' }))

      return screen.getByTestId('delegation-tab')
    }

    it('uses the full name of the logged-in user', () => {
      expect(open({ name: 'Ana Caroline' })).toHaveAttribute(
        'data-user-name',
        'Ana Caroline'
      )
    })

    it('falls back to the username when the name is blank', () => {
      expect(open({ name: '   ', username: 'ana.caroline' })).toHaveAttribute(
        'data-user-name',
        'ana.caroline'
      )
    })

    it('falls back to the email when there is no name or username', () => {
      expect(
        open({ name: '', username: '', email: 'ana@acme.com' })
      ).toHaveAttribute('data-user-name', 'ana@acme.com')
    })
  })
})
