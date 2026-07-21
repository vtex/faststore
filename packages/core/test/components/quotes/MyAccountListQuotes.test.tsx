/**
 * @vitest-environment jsdom
 */

import { fireEvent, render, screen } from '@testing-library/react'
import React from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const mockUseScreenResize = vi.hoisted(() => vi.fn())
vi.mock('src/sdk/ui/useScreenResize', () => ({
  default: mockUseScreenResize,
}))

vi.mock(
  '../../../src/components/account/quotes/MyAccountListQuotes/MyAccountListQuotesTable/MyAccountListQuotesTable',
  () => ({
    __esModule: true,
    default: () => <div data-testid="quotes-table" />,
    Pagination: ({ page }: { page: number }) => (
      <div data-testid="pagination">page {page}</div>
    ),
  })
)

vi.mock(
  '../../../src/components/account/quotes/MyAccountListQuotes/MyAccountQuotesFilterSlider/MyAccountQuotesFilterSlider',
  () => ({
    __esModule: true,
    default: () => <div data-testid="filter-slider" />,
  })
)

const mockUseUI = vi.hoisted(() => vi.fn())
vi.mock('@faststore/ui', async () => {
  const actual =
    await vi.importActual<typeof import('@faststore/ui')>('@faststore/ui')
  return {
    ...actual,
    useUI: mockUseUI,
    SearchInputField: React.forwardRef(function MockSearchInputField(
      { onBlur, onKeyDown }: any,
      ref: any
    ) {
      const inputRef = React.useRef<HTMLInputElement>(null)
      React.useImperativeHandle(ref, () => ({ inputRef: inputRef.current }))
      return (
        <input
          ref={inputRef}
          placeholder="Search"
          onBlur={onBlur}
          onKeyDown={onKeyDown}
        />
      )
    }),
  }
})

import MyAccountListQuotes from '../../../src/components/account/quotes/MyAccountListQuotes/MyAccountListQuotes'

const originalLocation = window.location

function stubLocation(search = '') {
  Object.defineProperty(window, 'location', {
    configurable: true,
    value: { ...originalLocation, search, href: '' },
  })
}

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

describe('MyAccountListQuotes', () => {
  const openFilter = vi.fn()

  beforeEach(() => {
    stubLocation()
    mockUseScreenResize.mockReturnValue({ isDesktop: true })
    mockUseUI.mockReturnValue({ openFilter, filter: false })
  })

  afterEach(() => {
    vi.clearAllMocks()
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: originalLocation,
    })
  })

  it('renders the quotes table when there are results', () => {
    render(
      <MyAccountListQuotes
        listQuotes={{ list: [{ id: 'q-1' }] } as any}
        total={1}
        perPage={25}
        filters={baseFilters()}
      />
    )

    expect(screen.getByTestId('quotes-table')).toBeTruthy()
  })

  it('renders the "no quotes" empty state when there are no results and no filters', () => {
    render(
      <MyAccountListQuotes
        listQuotes={{ list: [] } as any}
        total={0}
        perPage={25}
        filters={baseFilters()}
      />
    )

    expect(screen.getByText("You don't have any quotes")).toBeTruthy()
    expect(screen.queryByTestId('quotes-table')).toBeNull()
  })

  it('renders the "no results" empty state when filters are active but nothing matches', () => {
    render(
      <MyAccountListQuotes
        listQuotes={{ list: [] } as any}
        total={0}
        perPage={25}
        filters={baseFilters({ status: ['Draft'] })}
      />
    )

    expect(screen.getByText('No results found')).toBeTruthy()
  })

  it('opens the filter slider and dispatches the current selected facets when Filters is clicked', () => {
    render(
      <MyAccountListQuotes
        listQuotes={{ list: [] } as any}
        total={0}
        perPage={25}
        filters={baseFilters({ status: ['Draft'] })}
      />
    )

    fireEvent.click(screen.getByText('Filters'))

    expect(openFilter).toHaveBeenCalledTimes(1)
  })

  it('shows the active filter count badge', () => {
    render(
      <MyAccountListQuotes
        listQuotes={{ list: [] } as any}
        total={0}
        perPage={25}
        filters={baseFilters({ status: ['Draft'] })}
      />
    )

    expect(screen.getByText('1')).toBeTruthy()
  })

  it('renders the filter slider when the UI filter drawer is open', () => {
    mockUseUI.mockReturnValue({ openFilter, filter: true })

    render(
      <MyAccountListQuotes
        listQuotes={{ list: [] } as any}
        total={0}
        perPage={25}
        filters={baseFilters()}
      />
    )

    expect(screen.getByTestId('filter-slider')).toBeTruthy()
  })

  it('shows pagination on desktop when there are results', () => {
    mockUseScreenResize.mockReturnValue({ isDesktop: true })

    render(
      <MyAccountListQuotes
        listQuotes={{ list: [{ id: 'q-1' }] } as any}
        total={30}
        perPage={25}
        filters={baseFilters({ page: 2 })}
      />
    )

    expect(screen.getAllByTestId('pagination').length).toBeGreaterThan(0)
  })

  it('navigates with the search term on blur', async () => {
    render(
      <MyAccountListQuotes
        listQuotes={{ list: [] } as any}
        total={0}
        perPage={25}
        filters={baseFilters()}
      />
    )

    const input = screen.getByPlaceholderText('Search')
    fireEvent.change(input, { target: { value: 'ACME' } })
    fireEvent.blur(input)
    await new Promise((resolve) => setTimeout(resolve, 350))

    expect(window.location.href).toBe('/pvt/account/quotes?label=ACME')
  })

  it('navigates without a label param when the search is cleared', async () => {
    render(
      <MyAccountListQuotes
        listQuotes={{ list: [] } as any}
        total={0}
        perPage={25}
        filters={baseFilters({ label: 'ACME' })}
      />
    )

    const input = screen.getByPlaceholderText('Search')
    fireEvent.change(input, { target: { value: '' } })
    fireEvent.blur(input)
    await new Promise((resolve) => setTimeout(resolve, 350))

    expect(window.location.href).toBe('/pvt/account/quotes?')
  })
})
