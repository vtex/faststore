import '@testing-library/jest-dom/vitest'
import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

const mockUseAccountPageData = vi.hoisted(() => vi.fn())
const mockUseRouter = vi.hoisted(() => vi.fn(() => ({ reload: vi.fn() })))

vi.mock('next/router', () => ({ useRouter: mockUseRouter }))
vi.mock('src/sdk/account/accountPageContext', () => ({
  useAccountPageData: mockUseAccountPageData,
}))

import AccountListCards from 'src/components/sections/Account/AccountListCards'

afterEach(cleanup)

describe('AccountListCards', () => {
  it('reads accountPageData and forwards it to MyAccountListCards', () => {
    mockUseAccountPageData.mockReturnValueOnce({
      personalCards: [{ accountId: 'acc-1', paymentSystemName: 'Visa' }],
      sharedCards: [],
      hasOrgAssociation: false,
      canViewPersonalCards: true,
      hasError: false,
    })

    render(<AccountListCards />)

    expect(screen.getByText('Visa')).toBeInTheDocument()
  })

  it('falls back to empty card arrays when the page data omits them', () => {
    mockUseAccountPageData.mockReturnValueOnce({
      hasOrgAssociation: false,
      canViewPersonalCards: true,
      hasError: false,
    })

    render(<AccountListCards />)

    expect(screen.getByText("You don't have any cards")).toBeInTheDocument()
  })

  it('applies CMS-provided label overrides', () => {
    mockUseAccountPageData.mockReturnValueOnce({
      personalCards: [],
      sharedCards: [],
      hasOrgAssociation: false,
      canViewPersonalCards: true,
      hasError: false,
    })

    render(<AccountListCards pageTitle="Meus Cartões" />)

    expect(screen.getByText('Meus Cartões')).toBeInTheDocument()
  })
})
