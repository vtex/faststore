/**
 * @vitest-environment jsdom
 */

import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const mockUseAccountNavigationLabels = vi.hoisted(() => vi.fn())
vi.mock('src/sdk/account/accountPageContext', () => ({
  useAccountNavigationLabels: mockUseAccountNavigationLabels,
}))

import { OrganizationDrawerHeader } from '../../../src/components/account/Drawer/OrganizationDrawer/OrganizationDrawerHeader'

describe('OrganizationDrawerHeader', () => {
  beforeEach(() => {
    mockUseAccountNavigationLabels.mockReturnValue(undefined)
  })

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

  it('honors the CMS-provided change contract label', () => {
    mockUseAccountNavigationLabels.mockReturnValue({
      changeContractLabel: 'Trocar',
    })
    const onChangeContract = vi.fn()

    render(
      <OrganizationDrawerHeader
        contractName="Acme Corp"
        contractUrl={null}
        onChangeContract={onChangeContract}
      />
    )

    fireEvent.click(screen.getByRole('button', { name: 'Trocar' }))
    expect(onChangeContract).toHaveBeenCalledTimes(1)
  })
})
