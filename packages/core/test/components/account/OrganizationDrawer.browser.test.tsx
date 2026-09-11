/**
 * @vitest-environment jsdom
 */

import '@testing-library/jest-dom/vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import type { ReactNode } from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const mockFadeOut = vi.hoisted(() => vi.fn())
const mockUseSession = vi.hoisted(() => vi.fn())
const mockCloseDrawer = vi.hoisted(() => vi.fn())
const mockUseAvailableContracts = vi.hoisted(() => vi.fn())

vi.mock('@faststore/ui', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@faststore/ui')>()

  return {
    ...actual,
    useFadeEffect: () => ({ fade: 'in', fadeOut: mockFadeOut }),
    SlideOver: ({
      children,
      isOpen,
      onTransitionEnd,
    }: {
      children: ReactNode
      isOpen: boolean
      onTransitionEnd?: () => void
    }) =>
      isOpen ? (
        <div
          data-testid="organization-drawer"
          onTransitionEnd={onTransitionEnd}
        >
          {children}
        </div>
      ) : null,
  }
})

vi.mock('src/sdk/session', () => ({ useSession: mockUseSession }))

vi.mock('src/sdk/account/useAvailableContracts', () => ({
  useAvailableContracts: mockUseAvailableContracts,
}))

vi.mock(
  '../../../src/components/account/Drawer/OrganizationDrawer/ContractSwitcher',
  () => ({
    ContractSwitcher: ({
      onBack,
      onClose,
    }: {
      onBack: () => void
      onClose: () => void
    }) => (
      <div data-testid="contract-switcher">
        <button type="button" onClick={onBack}>
          Back to menu
        </button>
        <button type="button" onClick={onClose}>
          Close switcher
        </button>
      </div>
    ),
  })
)

vi.mock(
  '../../../src/components/account/Drawer/OrganizationDrawer/OrganizationDrawerBody',
  () => ({
    OrganizationDrawerBody: () => <nav data-fs-organization-drawer-body />,
  })
)

import { OrganizationDrawer } from '../../../src/components/account/Drawer/OrganizationDrawer/OrganizationDrawer'

describe('OrganizationDrawer', () => {
  beforeEach(() => {
    mockUseSession.mockReturnValue({
      b2b: {
        unitId: 'unit-1',
        unitName: 'Stellar Global',
        contractName: 'Acme Contract',
        userName: 'Jane Buyer',
        userEmail: 'jane@example.com',
        organizationManager: true,
      },
      person: { givenName: 'Jane' },
    })
    mockUseAvailableContracts.mockReturnValue({
      contracts: [],
      loading: false,
      error: null,
    })
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('renders the menu view with contract details and manage footer', () => {
    render(
      <OrganizationDrawer
        isOpen
        closeDrawer={mockCloseDrawer}
        isRepresentative={false}
      />
    )

    expect(screen.getByText('Acme Contract')).toBeTruthy()
    expect(screen.getByText('Stellar Global')).toBeTruthy()
    expect(screen.getByText('Jane Buyer')).toBeTruthy()
    expect(screen.getByRole('link', { name: /manage/i })).toBeTruthy()
    expect(screen.getByRole('button', { name: /change/i })).toBeTruthy()
  })

  it('opens the contract switcher and returns to the menu on back', () => {
    render(
      <OrganizationDrawer
        isOpen
        closeDrawer={mockCloseDrawer}
        isRepresentative={false}
      />
    )

    fireEvent.click(screen.getByRole('button', { name: /change/i }))
    expect(screen.getByTestId('contract-switcher')).toBeTruthy()

    fireEvent.click(screen.getByRole('button', { name: /back to menu/i }))
    expect(screen.queryByTestId('contract-switcher')).toBeNull()
    expect(screen.getByRole('button', { name: /change/i })).toBeTruthy()
  })

  it('resets to the menu when the drawer closes', () => {
    const { rerender } = render(
      <OrganizationDrawer
        isOpen
        closeDrawer={mockCloseDrawer}
        isRepresentative={false}
      />
    )

    fireEvent.click(screen.getByRole('button', { name: /change/i }))
    expect(screen.getByTestId('contract-switcher')).toBeTruthy()

    rerender(
      <OrganizationDrawer
        isOpen={false}
        closeDrawer={mockCloseDrawer}
        isRepresentative={false}
      />
    )

    rerender(
      <OrganizationDrawer
        isOpen
        closeDrawer={mockCloseDrawer}
        isRepresentative={false}
      />
    )

    expect(screen.queryByTestId('contract-switcher')).toBeNull()
    expect(screen.getByRole('button', { name: /change/i })).toBeTruthy()
  })

  it('falls back to person name when contract metadata is missing', () => {
    mockUseSession.mockReturnValue({
      b2b: {
        unitId: 'unit-1',
        userName: 'Jane Buyer',
      },
      person: { givenName: 'Jane' },
    })

    render(
      <OrganizationDrawer
        isOpen
        closeDrawer={mockCloseDrawer}
        isRepresentative={false}
      />
    )

    expect(screen.getByRole('heading', { name: 'Jane', level: 1 })).toBeTruthy()
  })

  it('hides contract switching when the buyer has no organization unit', () => {
    mockUseSession.mockReturnValue({
      b2b: {
        userName: 'Jane Buyer',
      },
      person: null,
    })

    render(
      <OrganizationDrawer
        isOpen
        closeDrawer={mockCloseDrawer}
        isRepresentative={false}
      />
    )

    expect(screen.queryByRole('button', { name: /change/i })).toBeNull()
    expect(
      screen.getByRole('heading', { name: 'Organization', level: 1 })
    ).toBeTruthy()
  })

  it('opens directly in the switcher when initialView is "switch"', () => {
    render(
      <OrganizationDrawer
        isOpen
        closeDrawer={vi.fn()}
        isRepresentative
        initialView="switch"
      />
    )
    expect(screen.getByTestId('contract-switcher')).toBeInTheDocument()
  })

  it('shows the default-contract star in the header when the active contract is the unit default', () => {
    mockUseAvailableContracts.mockReturnValue({
      contracts: [
        {
          id: 'unit-1',
          corporateName: 'Acme Contract',
          isActive: true,
          isDefault: true,
        },
        {
          id: 'other',
          corporateName: 'Other Contract',
          isActive: false,
          isDefault: false,
        },
      ],
      loading: false,
      error: null,
    })
    mockUseSession.mockReturnValue({
      b2b: {
        unitId: 'unit-1',
        unitName: 'Stellar Global',
        contractName: 'Acme Contract',
        customerId: 'unit-1',
        userName: 'Jane Buyer',
        userEmail: 'jane@example.com',
        organizationManager: true,
      },
      person: { givenName: 'Jane' },
    })

    render(
      <OrganizationDrawer
        isOpen
        closeDrawer={mockCloseDrawer}
        isRepresentative={false}
      />
    )

    expect(screen.getByLabelText('Default contract')).toBeTruthy()
  })

  it('does not show the default-contract star when the active contract is not the unit default', () => {
    mockUseAvailableContracts.mockReturnValue({
      contracts: [
        {
          id: 'unit-1',
          corporateName: 'Acme Contract',
          isActive: true,
          isDefault: false,
        },
        {
          id: 'other',
          corporateName: 'Other Contract',
          isActive: false,
          isDefault: true,
        },
      ],
      loading: false,
      error: null,
    })
    mockUseSession.mockReturnValue({
      b2b: {
        unitId: 'unit-1',
        unitName: 'Stellar Global',
        contractName: 'Acme Contract',
        customerId: 'unit-1',
        userName: 'Jane Buyer',
        userEmail: 'jane@example.com',
        organizationManager: true,
      },
      person: { givenName: 'Jane' },
    })

    render(
      <OrganizationDrawer
        isOpen
        closeDrawer={mockCloseDrawer}
        isRepresentative={false}
      />
    )

    expect(screen.queryByLabelText('Default contract')).toBeNull()
  })

  it('fetches the contract list only while open for an org member', () => {
    const { rerender } = render(
      <OrganizationDrawer
        isOpen={false}
        closeDrawer={mockCloseDrawer}
        isRepresentative={false}
      />
    )

    expect(mockUseAvailableContracts).toHaveBeenLastCalledWith(false)

    rerender(
      <OrganizationDrawer
        isOpen
        closeDrawer={mockCloseDrawer}
        isRepresentative={false}
      />
    )

    expect(mockUseAvailableContracts).toHaveBeenLastCalledWith(true)
  })

  it('never fetches the contract list when the buyer has no organization unit', () => {
    mockUseSession.mockReturnValue({
      b2b: { userName: 'Jane Buyer' },
      person: null,
    })

    render(
      <OrganizationDrawer
        isOpen
        closeDrawer={mockCloseDrawer}
        isRepresentative={false}
      />
    )

    expect(mockUseAvailableContracts).toHaveBeenLastCalledWith(false)
  })
})
