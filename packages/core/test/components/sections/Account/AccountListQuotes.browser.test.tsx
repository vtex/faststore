/**
 * @vitest-environment jsdom
 */

import '@testing-library/jest-dom/vitest'
import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const mockUseAccountPageData = vi.hoisted(() => vi.fn())
const mockUseScreenResize = vi.hoisted(() => vi.fn())
const mockUseSession = vi.hoisted(() => vi.fn())
const mockUseUI = vi.hoisted(() => vi.fn())

vi.mock('src/sdk/account/accountPageContext', () => ({
  useAccountPageData: mockUseAccountPageData,
}))
vi.mock('src/sdk/ui/useScreenResize', () => ({
  default: mockUseScreenResize,
}))
vi.mock('src/sdk/session', () => ({ useSession: mockUseSession }))
vi.mock('@faststore/ui', async () => {
  const actual =
    await vi.importActual<typeof import('@faststore/ui')>('@faststore/ui')
  return {
    ...actual,
    useUI: mockUseUI,
  }
})

import AccountListQuotes from 'src/components/sections/Account/AccountListQuotes'

afterEach(cleanup)

function baseFilters(overrides: Record<string, unknown> = {}) {
  return {
    page: 1,
    status: [],
    createdAtFrom: '',
    createdAtTo: '',
    expiresAtFrom: '',
    expiresAtTo: '',
    label: '',
    ...overrides,
  }
}

describe('AccountListQuotes', () => {
  beforeEach(() => {
    mockUseScreenResize.mockReturnValue({ isDesktop: true })
    mockUseSession.mockReturnValue({
      locale: 'en-US',
      currency: { code: 'USD' },
    })
    mockUseUI.mockReturnValue({ openFilter: vi.fn(), filter: false })
  })

  it('reads accountPageData and renders the default English page title', () => {
    mockUseAccountPageData.mockReturnValueOnce({
      listQuotes: { list: [] },
      total: 0,
      perPage: 25,
      filters: baseFilters(),
    })

    render(<AccountListQuotes />)

    expect(screen.getByText('Quotes')).toBeInTheDocument()
    expect(screen.getByText("You don't have any quotes")).toBeInTheDocument()
  })

  it('applies CMS-provided label overrides', () => {
    mockUseAccountPageData.mockReturnValueOnce({
      listQuotes: { list: [] },
      total: 0,
      perPage: 25,
      filters: baseFilters(),
    })

    render(
      <AccountListQuotes
        pageTitle="Cotações"
        noQuotesLabel="Você não tem cotações"
      />
    )

    expect(screen.getByText('Cotações')).toBeInTheDocument()
    expect(screen.getByText('Você não tem cotações')).toBeInTheDocument()
  })

  it('forwards a CMS-provided quote status label down to the rendered rows', () => {
    mockUseAccountPageData.mockReturnValueOnce({
      listQuotes: {
        list: [
          {
            id: 'q-1',
            status: 'Approved',
            label: null,
            createdAt: '2026-01-01T10:00:00Z',
            expiresAt: '2099-01-01T00:00:00Z',
            amount: 100,
            createdBy: null,
          },
        ],
      },
      total: 1,
      perPage: 25,
      filters: baseFilters(),
    })

    render(<AccountListQuotes approvedStatus="Aprovado" />)

    expect(screen.getByText('Aprovado')).toBeInTheDocument()
  })
})
