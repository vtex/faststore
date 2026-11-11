/**
 * @vitest-environment jsdom
 */

import '@testing-library/jest-dom/vitest'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const mockUseDelegations = vi.hoisted(() => vi.fn())
const mockStartSession = vi.hoisted(() => vi.fn())
const mockUseDelegatedSession = vi.hoisted(() => vi.fn())

vi.mock('src/sdk/account/useDelegations', () => ({
  useDelegations: mockUseDelegations,
}))
vi.mock('src/sdk/account/useDelegatedSession', () => ({
  useDelegatedSession: mockUseDelegatedSession,
}))

import { OrganizationDrawerDelegations } from '../../../src/components/account/Drawer/OrganizationDrawer/OrganizationDrawerDelegations'

const granter = (n: number) => ({
  id: `delegation-${n}`,
  granterUserId: `user-${n}`,
  granterUsername: `user${n}`,
  granterEmail: `user${n}@stellar.com`,
  startDate: '2026-01-01',
  endDate: null,
})

describe('OrganizationDrawerDelegations', () => {
  beforeEach(() => {
    mockStartSession.mockReset().mockResolvedValue(true)
    mockUseDelegatedSession.mockReturnValue({
      startSession: mockStartSession,
      loading: false,
      error: null,
    })
    mockUseDelegations.mockReturnValue({ actingFor: [], error: null })
  })

  it('renders nothing without delegations', () => {
    const { container } = render(<OrganizationDrawerDelegations />)
    expect(container).toBeEmptyDOMElement()
  })

  it('renders nothing when the delegations fail to load', () => {
    mockUseDelegations.mockReturnValue({
      actingFor: [granter(1)],
      error: new Error('boom'),
    })
    const { container } = render(<OrganizationDrawerDelegations />)
    expect(container).toBeEmptyDOMElement()
  })

  it('shows a single delegation directly, without a toggle', () => {
    mockUseDelegations.mockReturnValue({
      actingFor: [granter(1)],
      error: null,
    })
    render(<OrganizationDrawerDelegations />)

    expect(screen.getByText('user1')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Impersonate' })).toBeVisible()
    expect(screen.queryByText(/delegation/)).not.toBeInTheDocument()
  })

  it('collapses several delegations behind a toggle', () => {
    mockUseDelegations.mockReturnValue({
      actingFor: [granter(1), granter(2), granter(3)],
      error: null,
    })
    render(<OrganizationDrawerDelegations />)

    expect(screen.queryByText('user1')).not.toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: /3 delegations/ }))
    expect(screen.getByText('user1')).toBeInTheDocument()
    expect(screen.getByText('user3')).toBeInTheDocument()
  })

  it('starts the session with the delegation and the original user', async () => {
    mockUseDelegations.mockReturnValue({
      actingFor: [granter(1), granter(2)],
      error: null,
    })
    render(<OrganizationDrawerDelegations />)

    fireEvent.click(screen.getByRole('button', { name: /2 delegations/ }))
    fireEvent.click(screen.getAllByRole('button', { name: 'Impersonate' })[1])

    await waitFor(() =>
      expect(mockStartSession).toHaveBeenCalledWith({
        originalUserId: 'user-2',
        delegationId: 'delegation-2',
      })
    )
  })

  it('falls back to the email, then to a dash, when there is no username', () => {
    mockUseDelegations.mockReturnValue({
      actingFor: [
        { ...granter(1), granterUsername: null },
        { ...granter(2), granterUsername: ' ', granterEmail: null },
      ],
      error: null,
    })
    render(<OrganizationDrawerDelegations />)

    fireEvent.click(screen.getByRole('button', { name: /2 delegations/ }))
    expect(screen.getByText('user1@stellar.com')).toBeInTheDocument()
    expect(screen.getByText('–')).toBeInTheDocument()
  })

  it('shows an error when the session cannot start', () => {
    mockUseDelegations.mockReturnValue({
      actingFor: [granter(1)],
      error: null,
    })
    mockUseDelegatedSession.mockReturnValue({
      startSession: mockStartSession,
      loading: false,
      error: new Error('nope'),
    })
    render(<OrganizationDrawerDelegations />)

    expect(screen.getByRole('alert')).toHaveTextContent(/couldn't start/)
  })
})
