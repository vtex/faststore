/**
 * @vitest-environment jsdom
 */

import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { OrganizationDrawerFooter } from '../../../src/components/account/Drawer/OrganizationDrawer/OrganizationDrawerFooter'
import PageProvider from '../../../src/sdk/overrides/PageProvider'

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

  it('uses the default English manage/logout labels when rendered outside a My Account page context', () => {
    render(
      <OrganizationDrawerFooter
        orgName="Stellar Global"
        userName="Jane Buyer"
        showManageLink
        manageUrl="/pvt/organization-account/org-unit/unit-1"
      />
    )

    expect(screen.getByText('Manage')).toBeTruthy()
    expect(screen.getByRole('button', { name: 'Log out' })).toBeTruthy()
  })

  it('uses the default labels inside a non-account page context', () => {
    render(
      <PageProvider context={{ globalSettings: {} }}>
        <OrganizationDrawerFooter
          orgName="Stellar Global"
          userName="Jane Buyer"
          showManageLink
          manageUrl="/pvt/organization-account/org-unit/unit-1"
        />
      </PageProvider>
    )

    expect(screen.getByText('Manage')).toBeTruthy()
    expect(screen.getByRole('button', { name: 'Log out' })).toBeTruthy()
  })

  it('uses the CMS-provided navigation labels when rendered inside a My Account page', () => {
    render(
      <PageProvider
        context={{
          accountPageData: {},
          navigationLabels: {
            manageLabel: 'Gerenciar',
            logoutLabel: 'Sair',
          },
        }}
      >
        <OrganizationDrawerFooter
          orgName="Stellar Global"
          userName="Jane Buyer"
          showManageLink
          manageUrl="/pvt/organization-account/org-unit/unit-1"
        />
      </PageProvider>
    )

    expect(screen.getByText('Gerenciar')).toBeTruthy()
    expect(screen.getByRole('button', { name: 'Sair' })).toBeTruthy()
  })

  it('lets an explicit label prop win over the CMS-provided navigation labels', () => {
    render(
      <PageProvider
        context={{
          accountPageData: {},
          navigationLabels: {
            manageLabel: 'Gerenciar',
            logoutLabel: 'Sair',
          },
        }}
      >
        <OrganizationDrawerFooter
          orgName="Stellar Global"
          userName="Jane Buyer"
          showManageLink
          manageUrl="/pvt/organization-account/org-unit/unit-1"
          manageLabel="Manage account"
          logoutLabel="Sign out"
        />
      </PageProvider>
    )

    expect(screen.getByText('Manage account')).toBeTruthy()
    expect(screen.getByRole('button', { name: 'Sign out' })).toBeTruthy()
  })

  it('does not render the manage link when showManageLink is false', () => {
    render(
      <OrganizationDrawerFooter
        orgName="Stellar Global"
        userName="Jane Buyer"
        showManageLink={false}
        manageUrl="/pvt/organization-account/org-unit/unit-1"
      />
    )

    expect(screen.queryByText('Manage')).toBeNull()
  })
})
