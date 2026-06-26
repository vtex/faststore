/**
 * @vitest-environment jsdom
 */

import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { OrganizationDrawerFooter } from '../../../src/components/account/Drawer/OrganizationDrawer/OrganizationDrawerFooter'

describe('OrganizationDrawerFooter', () => {
  it('renders org and user details with optional email', () => {
    render(
      <OrganizationDrawerFooter
        orgName="Stellar Global"
        userName="Jane Buyer"
        userEmail="jane@example.com"
      />
    )

    expect(screen.getByText('Stellar Global')).toBeTruthy()
    expect(screen.getByText('Jane Buyer')).toBeTruthy()
    expect(screen.getByText('jane@example.com')).toBeTruthy()
  })

  it('shows manage link for organization managers', () => {
    render(
      <OrganizationDrawerFooter
        orgName="Stellar Global"
        userName="Jane Buyer"
        showManageLink
        manageUrl="/pvt/organization-account/org-unit/unit-1"
      />
    )

    expect(
      screen.getByRole('link', { name: /manage/i }).getAttribute('href')
    ).toBe('/pvt/organization-account/org-unit/unit-1')
  })

  it('calls onLogoutClick from the logout button', () => {
    const onLogoutClick = vi.fn()

    render(
      <OrganizationDrawerFooter
        orgName="Stellar Global"
        userName="Jane Buyer"
        onLogoutClick={onLogoutClick}
      />
    )

    fireEvent.click(screen.getByRole('button', { name: /log out/i }))
    expect(onLogoutClick).toHaveBeenCalledTimes(1)
  })
})
