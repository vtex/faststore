import '@testing-library/jest-dom/vitest'
import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

const mockResolveLink = vi.hoisted(() => vi.fn())

vi.mock('src/sdk/session', () => ({
  useSession: () => ({ b2b: { unitId: 'unit-1' } }),
}))

vi.mock('src/sdk/account/accountPageContext', () => ({
  useAccountNavigationLabels: () => undefined,
}))

vi.mock('src/sdk/ui/useLink', () => ({
  useLink: () => ({ resolveLink: mockResolveLink }),
}))

vi.mock('next/link', () => ({
  __esModule: true,
  default: () => {
    throw new Error('ProfileSummary must not render next/link')
  },
}))

import { ProfileSummary } from '../../../src/components/account/Drawer/ProfileSummary/ProfileSummary'

const person = { name: 'Jane', email: 'jane@store.test' }

describe('ProfileSummary manage link', () => {
  it('renders a plain anchor to the organization account', () => {
    mockResolveLink.mockImplementation((href: string) => href)

    render(<ProfileSummary orgName="Org" person={person} showManageLink />)

    const link = screen.getByRole('link', { name: /Manage/ })

    expect(link.tagName).toBe('A')
    expect(link).toHaveAttribute(
      'href',
      '/pvt/organization-account/org-unit/unit-1'
    )
  })

  it('keeps the locale prefix resolved by useLink', () => {
    mockResolveLink.mockImplementation((href: string) => `/fr-CA${href}`)

    render(<ProfileSummary orgName="Org" person={person} showManageLink />)

    expect(screen.getByRole('link', { name: /Manage/ })).toHaveAttribute(
      'href',
      '/fr-CA/pvt/organization-account/org-unit/unit-1'
    )
  })

  it('does not render the link unless showManageLink is set', () => {
    mockResolveLink.mockImplementation((href: string) => href)

    render(<ProfileSummary orgName="Org" person={person} />)

    expect(screen.queryByRole('link')).toBeNull()
  })
})
