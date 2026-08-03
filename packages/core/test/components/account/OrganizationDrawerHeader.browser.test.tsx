/**
 * @vitest-environment jsdom
 */

import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { OrganizationDrawerHeader } from '../../../src/components/account/Drawer/OrganizationDrawer/OrganizationDrawerHeader'

describe('OrganizationDrawerHeader', () => {
  it('renders contract name fallback initial and links when contractUrl is set', () => {
    render(
      <OrganizationDrawerHeader
        contractName="Acme Corp"
        contractUrl="/pvt/organization-account/org-unit/unit-1"
        onCloseDrawer={vi.fn()}
      />
    )

    expect(screen.getByText('Acme Corp')).toBeTruthy()
    expect(screen.getByLabelText('Acme Corp').getAttribute('href')).toBe(
      '/pvt/organization-account/org-unit/unit-1'
    )
    expect(screen.getByText('A')).toBeTruthy()
  })

  it('shows default star and Change action when configured', () => {
    const onChangeContract = vi.fn()

    render(
      <OrganizationDrawerHeader
        contractName="Acme Corp"
        contractUrl={null}
        isDefault
        onChangeContract={onChangeContract}
      />
    )

    fireEvent.click(screen.getByRole('button', { name: /change/i }))
    expect(onChangeContract).toHaveBeenCalledTimes(1)
  })

  it('renders custom contract image and omits manage links without contractUrl', () => {
    render(
      <OrganizationDrawerHeader
        contractName="Acme Corp"
        contractUrl={null}
        contractImage={<img alt="Logo" src="/logo.png" />}
      />
    )

    expect(screen.getByAltText('Logo')).toBeTruthy()
    expect(screen.queryByRole('link', { name: /acme corp/i })).toBeNull()
  })
})
