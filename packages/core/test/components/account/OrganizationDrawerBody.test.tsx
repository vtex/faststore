/**
 * @vitest-environment jsdom
 */

import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const mockUseAccountNavigationLabels = vi.hoisted(() => vi.fn())
vi.mock('src/sdk/account/accountPageContext', () => ({
  useAccountNavigationLabels: mockUseAccountNavigationLabels,
}))

const mockResolveLink = vi.hoisted(() => vi.fn())
vi.mock('src/sdk/ui/useLink', () => ({
  useLink: () => ({ resolveLink: mockResolveLink }),
}))

import { OrganizationDrawerBody } from '../../../src/components/account/Drawer/OrganizationDrawer/OrganizationDrawerBody'

describe('OrganizationDrawerBody', () => {
  beforeEach(() => {
    mockResolveLink.mockReset()
    mockResolveLink.mockImplementation((href: string) => href)
  })

  it('hides the Quotes route when the user is not an org member', () => {
    mockUseAccountNavigationLabels.mockReturnValue(undefined)

    render(<OrganizationDrawerBody isB2BBuyer isOrgMember={false} />)

    expect(screen.queryByText('Quotes')).toBeNull()
    expect(screen.getByText('Profile')).toBeTruthy()
  })

  it('shows the Quotes route when the user belongs to an org unit', () => {
    mockUseAccountNavigationLabels.mockReturnValue(undefined)

    render(<OrganizationDrawerBody isB2BBuyer isOrgMember />)

    expect(screen.getByText('Quotes')).toBeTruthy()
  })

  it('hides User Details when not a representative, regardless of org membership', () => {
    mockUseAccountNavigationLabels.mockReturnValue(undefined)

    render(<OrganizationDrawerBody isB2BBuyer={false} isOrgMember />)

    expect(screen.queryByText('User Details')).toBeNull()
    expect(screen.getByText('Quotes')).toBeTruthy()
  })

  it('renders every route as a plain anchor with its route as href', () => {
    mockUseAccountNavigationLabels.mockReturnValue(undefined)

    render(<OrganizationDrawerBody isB2BBuyer isOrgMember />)

    const link = screen.getByText('Profile').closest('a')

    expect(link).not.toBeNull()
    expect(link?.getAttribute('href')).toBe('/pvt/account/profile')
  })

  it('keeps the non-default locale prefix in the hrefs', () => {
    mockUseAccountNavigationLabels.mockReturnValue(undefined)
    mockResolveLink.mockImplementation((href: string) => `/fr-CA${href}`)

    render(<OrganizationDrawerBody isB2BBuyer isOrgMember />)

    expect(screen.getByText('Profile').closest('a')?.getAttribute('href')).toBe(
      '/fr-CA/pvt/account/profile'
    )
    expect(screen.getByText('Orders').closest('a')?.getAttribute('href')).toBe(
      '/fr-CA/pvt/account/orders'
    )
  })

  it('falls back to the raw route when resolveLink returns undefined', () => {
    mockUseAccountNavigationLabels.mockReturnValue(undefined)
    mockResolveLink.mockReturnValue(undefined)

    render(<OrganizationDrawerBody isB2BBuyer isOrgMember />)

    expect(screen.getByText('Profile').closest('a')?.getAttribute('href')).toBe(
      '/pvt/account/profile'
    )
  })
})
