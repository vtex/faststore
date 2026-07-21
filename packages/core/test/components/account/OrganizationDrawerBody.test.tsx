/**
 * @vitest-environment jsdom
 */

import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

const mockUseAccountNavigationLabels = vi.hoisted(() => vi.fn())
vi.mock('src/sdk/account/accountPageContext', () => ({
  useAccountNavigationLabels: mockUseAccountNavigationLabels,
}))

vi.mock('src/components/ui/Link', () => ({
  __esModule: true,
  default: ({
    href,
    children,
  }: {
    href: string
    children: React.ReactNode
  }) => <a href={href}>{children}</a>,
}))

import { OrganizationDrawerBody } from '../../../src/components/account/Drawer/OrganizationDrawer/OrganizationDrawerBody'

describe('OrganizationDrawerBody', () => {
  it('hides the Quotes route when the user is not an org member', () => {
    mockUseAccountNavigationLabels.mockReturnValue(undefined)

    render(<OrganizationDrawerBody isRepresentative isOrgMember={false} />)

    expect(screen.queryByText('Quotes')).toBeNull()
    expect(screen.getByText('Profile')).toBeTruthy()
  })

  it('shows the Quotes route when the user belongs to an org unit', () => {
    mockUseAccountNavigationLabels.mockReturnValue(undefined)

    render(<OrganizationDrawerBody isRepresentative isOrgMember />)

    expect(screen.getByText('Quotes')).toBeTruthy()
  })

  it('hides User Details when not a representative, regardless of org membership', () => {
    mockUseAccountNavigationLabels.mockReturnValue(undefined)

    render(<OrganizationDrawerBody isRepresentative={false} isOrgMember />)

    expect(screen.queryByText('User Details')).toBeNull()
    expect(screen.getByText('Quotes')).toBeTruthy()
  })
})
