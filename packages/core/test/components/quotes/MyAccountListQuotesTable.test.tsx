/**
 * @vitest-environment jsdom
 */

import { render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const mockUseSession = vi.hoisted(() => vi.fn())
const mockUseScreenResize = vi.hoisted(() => vi.fn())
vi.mock('src/sdk/session', () => ({ useSession: mockUseSession }))
vi.mock('src/sdk/ui/useScreenResize', () => ({
  default: mockUseScreenResize,
}))

import MyAccountListQuotesTable, {
  Pagination,
} from '../../../src/components/account/quotes/MyAccountListQuotes/MyAccountListQuotesTable/MyAccountListQuotesTable'

const originalLocation = window.location

function stubLocation() {
  Object.defineProperty(window, 'location', {
    configurable: true,
    value: { ...originalLocation, search: '', href: '' },
  })
}

function baseFilters(page = 1) {
  return {
    page,
    status: [],
    createdAtFrom: '',
    createdAtTo: '',
    expiresAtFrom: '',
    expiresAtTo: '',
    label: '',
  }
}

function baseQuote(overrides: Partial<Record<string, unknown>> = {}) {
  return {
    id: 'q-1',
    status: 'Draft',
    label: null,
    createdAt: '2026-01-01T10:00:00Z',
    expiresAt: '2099-01-01T00:00:00Z',
    amount: 150.5,
    createdBy: null,
    ...overrides,
  }
}

describe('MyAccountListQuotesTable', () => {
  beforeEach(() => {
    stubLocation()
    mockUseSession.mockReturnValue({
      locale: 'en-US',
      currency: { code: 'USD' },
    })
  })

  afterEach(() => {
    vi.clearAllMocks()
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: originalLocation,
    })
  })

  it('renders a row per quote with id, status and formatted amount', () => {
    mockUseScreenResize.mockReturnValue({ isDesktop: true })

    render(
      <MyAccountListQuotesTable
        listQuotes={{ list: [baseQuote()], paging: {} as any }}
        total={1}
        perPage={25}
        filters={baseFilters()}
      />
    )

    expect(screen.getByText('q-1')).toBeTruthy()
    expect(screen.getByText('Draft')).toBeTruthy()
    expect(screen.getByText('$150.50')).toBeTruthy()
  })

  it('renders the label when present and omits it when absent', () => {
    mockUseScreenResize.mockReturnValue({ isDesktop: true })

    const { rerender } = render(
      <MyAccountListQuotesTable
        listQuotes={{
          list: [baseQuote({ label: 'My favorite quote' })],
          paging: {} as any,
        }}
        total={1}
        perPage={25}
        filters={baseFilters()}
      />
    )
    expect(screen.getByText('My favorite quote')).toBeTruthy()

    rerender(
      <MyAccountListQuotesTable
        listQuotes={{ list: [baseQuote({ label: null })], paging: {} as any }}
        total={1}
        perPage={25}
        filters={baseFilters()}
      />
    )
    expect(screen.queryByText('My favorite quote')).toBeNull()
  })

  it('hides the dates column on mobile', () => {
    mockUseScreenResize.mockReturnValue({ isDesktop: false })

    render(
      <MyAccountListQuotesTable
        listQuotes={{ list: [baseQuote()], paging: {} as any }}
        total={1}
        perPage={25}
        filters={baseFilters()}
      />
    )

    expect(screen.queryByText('Creation date')).toBeNull()
  })

  it('shows "Created by" only when createdBy is set', () => {
    mockUseScreenResize.mockReturnValue({ isDesktop: true })

    render(
      <MyAccountListQuotesTable
        listQuotes={{
          list: [baseQuote({ createdBy: 'Ada Lovelace' })],
          paging: {} as any,
        }}
        total={1}
        perPage={25}
        filters={baseFilters()}
      />
    )

    expect(screen.getByText('Created by')).toBeTruthy()
    expect(screen.getByText('Ada Lovelace')).toBeTruthy()
  })

  it('shows a relative expiry hint for quotes expiring soon', () => {
    mockUseScreenResize.mockReturnValue({ isDesktop: true })
    const soon = new Date(Date.now() + 3 * 3_600_000).toISOString()

    render(
      <MyAccountListQuotesTable
        listQuotes={{
          list: [baseQuote({ expiresAt: soon })],
          paging: {} as any,
        }}
        total={1}
        perPage={25}
        filters={baseFilters()}
      />
    )

    expect(screen.getByText(/hours left/)).toBeTruthy()
  })

  it('omits the relative expiry hint for already-expired quotes', () => {
    mockUseScreenResize.mockReturnValue({ isDesktop: true })
    const past = new Date(Date.now() - 3_600_000).toISOString()

    render(
      <MyAccountListQuotesTable
        listQuotes={{
          list: [baseQuote({ expiresAt: past })],
          paging: {} as any,
        }}
        total={1}
        perPage={25}
        filters={baseFilters()}
      />
    )

    expect(screen.queryByText(/left/)).toBeNull()
  })
})

describe('Pagination', () => {
  beforeEach(() => {
    stubLocation()
  })

  afterEach(() => {
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: originalLocation,
    })
  })

  it('renders the current index range', () => {
    render(<Pagination page={2} total={60} perPage={25} />)

    expect(screen.getByText('26 — 50 of 60')).toBeTruthy()
  })

  it('caps the last index label at the total', () => {
    render(<Pagination page={3} total={60} perPage={25} />)

    expect(screen.getByText('51 — 60 of 60')).toBeTruthy()
  })

  it('disables the previous button on the first page', () => {
    render(<Pagination page={1} total={60} perPage={25} />)

    const button = screen.getByRole('button', { name: 'Previous Page' })
    expect((button as HTMLButtonElement).disabled).toBe(true)
  })

  it('disables the next button on the last page', () => {
    render(<Pagination page={3} total={60} perPage={25} />)

    const button = screen.getByRole('button', { name: 'Next Page' })
    expect((button as HTMLButtonElement).disabled).toBe(true)
  })

  it('navigates without a page param when going back to page 1', () => {
    render(<Pagination page={2} total={60} perPage={25} />)

    screen.getByRole('button', { name: 'Previous Page' }).click()

    expect(window.location.href).toBe('/pvt/account/quotes')
  })

  it('navigates with the target page param otherwise', () => {
    render(<Pagination page={1} total={60} perPage={25} />)

    screen.getByRole('button', { name: 'Next Page' }).click()

    expect(window.location.href).toBe('/pvt/account/quotes?page=2')
  })
})
