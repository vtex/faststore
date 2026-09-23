/**
 * @vitest-environment jsdom
 */

import '@testing-library/jest-dom/vitest'
import { act, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const mockUseSession = vi.hoisted(() => vi.fn())
const mockUseScreenResize = vi.hoisted(() => vi.fn())
const mockOrganizationDrawer = vi.hoisted(() => vi.fn())

vi.mock('src/sdk/session', () => ({ useSession: mockUseSession }))

vi.mock('src/sdk/account/accountPageContext', () => ({
  useAccountNavigationLabels: () => ({ switchLabel: 'Switch' }),
}))

vi.mock('src/sdk/ui/useScreenResize', () => ({
  default: mockUseScreenResize,
}))

vi.mock('next/router', () => ({
  useRouter: () => ({ pathname: '/pvt/account' }),
}))

vi.mock(
  '../../../src/components/account/Drawer/OrganizationDrawer/OrganizationDrawer',
  () => ({
    OrganizationDrawer: (props: Record<string, unknown>) => {
      mockOrganizationDrawer(props)
      return <div data-testid="organization-drawer" />
    },
  })
)

import Menu from '../../../src/components/account/Menu/Menu'

const items = [{ title: 'Orders', route: '/pvt/account/orders' }]

describe('Menu', () => {
  beforeEach(() => {
    mockUseScreenResize.mockReturnValue({ isDesktop: true })
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('does not render the Switch button without an organization unit', () => {
    mockUseSession.mockReturnValue({ b2b: {} })

    render(<Menu accountName="Jane" items={items} />)

    expect(screen.queryByRole('button', { name: 'Switch' })).toBeNull()
  })

  it('renders the Switch button when the buyer has an organization unit', () => {
    mockUseSession.mockReturnValue({ b2b: { unitId: 'unit-1' } })

    render(<Menu accountName="Jane" items={items} />)

    expect(screen.getByRole('button', { name: 'Switch' })).toBeTruthy()
  })

  it('mounts the OrganizationDrawer with initialView "switch" when Switch is clicked', () => {
    mockUseSession.mockReturnValue({
      b2b: { unitId: 'unit-1', isRepresentative: true },
    })

    render(<Menu accountName="Jane" items={items} />)

    expect(screen.queryByTestId('organization-drawer')).toBeNull()

    fireEvent.click(screen.getByRole('button', { name: 'Switch' }))

    expect(screen.getByTestId('organization-drawer')).toBeTruthy()
    expect(mockOrganizationDrawer).toHaveBeenCalledWith(
      expect.objectContaining({
        isOpen: true,
        initialView: 'switch',
        isRepresentative: true,
      })
    )
  })

  it('passes isRepresentative as a boolean even when b2b.isRepresentative is undefined', () => {
    mockUseSession.mockReturnValue({ b2b: { unitId: 'unit-1' } })

    render(<Menu accountName="Jane" items={items} />)
    fireEvent.click(screen.getByRole('button', { name: 'Switch' }))

    expect(mockOrganizationDrawer).toHaveBeenCalledWith(
      expect.objectContaining({ isRepresentative: false })
    )
  })

  it('unmounts the OrganizationDrawer when closeDrawer is invoked', () => {
    mockUseSession.mockReturnValue({ b2b: { unitId: 'unit-1' } })

    render(<Menu accountName="Jane" items={items} />)
    fireEvent.click(screen.getByRole('button', { name: 'Switch' }))
    expect(screen.getByTestId('organization-drawer')).toBeTruthy()

    const closeDrawer = mockOrganizationDrawer.mock.calls[0][0]
      .closeDrawer as () => void
    act(() => {
      closeDrawer()
    })

    expect(screen.queryByTestId('organization-drawer')).toBeNull()
  })

  it('renders only the nav list on mobile (no account/switch area)', () => {
    mockUseScreenResize.mockReturnValue({ isDesktop: false })
    mockUseSession.mockReturnValue({ b2b: { unitId: 'unit-1' } })

    render(<Menu accountName="Jane" items={items} />)

    expect(screen.queryByRole('button', { name: 'Switch' })).toBeNull()
    expect(screen.getByText('Orders')).toBeTruthy()
  })
})
