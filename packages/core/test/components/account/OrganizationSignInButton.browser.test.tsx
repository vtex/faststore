/**
 * @vitest-environment jsdom
 */
import '@testing-library/jest-dom/vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

const mockUseSession = vi.hoisted(() => vi.fn())
const mockOrganizationDrawer = vi.hoisted(() =>
  vi.fn((_props: Record<string, unknown>) => null)
)
vi.mock('src/sdk/session', () => ({ useSession: mockUseSession }))
vi.mock('src/sdk/account/accountPageContext', () => ({
  useAccountNavigationLabels: () => ({
    companyLabel: 'Company',
    contractLabel: 'Contract',
  }),
}))
vi.mock(
  'src/components/account/Drawer/OrganizationDrawer/OrganizationDrawer',
  () => ({
    OrganizationDrawer: mockOrganizationDrawer,
  })
)

import { OrganizationSignInButton } from '../../../src/components/account/Drawer/OrganizationSignInButton/OrganizationSignInButton'

const icon = { alt: 'account', icon: 'User' }

describe('OrganizationSignInButton', () => {
  it('shows the active contract name when the session has one (Design QA 00:02:55)', () => {
    mockUseSession.mockReturnValue({
      person: { id: 'p1' },
      b2b: { contractName: ' Caetano Corp ' },
    })
    render(<OrganizationSignInButton icon={icon} isB2BBuyer />)
    expect(screen.getByRole('button', { name: 'account' })).toHaveTextContent(
      'Caetano Corp'
    )
  })

  it('falls back to the company label without a contract name', () => {
    mockUseSession.mockReturnValue({
      person: { id: 'p1' },
      b2b: { contractName: '' },
    })
    render(<OrganizationSignInButton icon={icon} isB2BBuyer />)
    expect(screen.getByRole('button', { name: 'account' })).toHaveTextContent(
      'Company'
    )
  })

  it.each([
    ['isB2BBuyer', { isB2BBuyer: true }],
    ['the deprecated isRepresentative', { isRepresentative: true }],
  ])('opens the drawer as a B2B buyer from %s', (_label, props) => {
    mockUseSession.mockReturnValue({ person: { id: 'p1' }, b2b: {} })
    render(<OrganizationSignInButton icon={icon} {...props} />)
    fireEvent.click(screen.getByRole('button', { name: 'account' }))
    expect(mockOrganizationDrawer.mock.lastCall?.[0]).toMatchObject({
      isB2BBuyer: true,
    })
  })
})
