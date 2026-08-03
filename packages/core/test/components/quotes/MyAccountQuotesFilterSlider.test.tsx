/**
 * @vitest-environment jsdom
 */

import { fireEvent, render, screen } from '@testing-library/react'
import React from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('@faststore/ui', async () => {
  const actual =
    await vi.importActual<typeof import('@faststore/ui')>('@faststore/ui')
  return {
    ...actual,
    FilterSlider: ({
      children,
      applyBtnProps,
      clearBtnProps,
    }: React.PropsWithChildren<{
      applyBtnProps?: { onClick?: () => void; children?: React.ReactNode }
      clearBtnProps?: { onClick?: () => void; children?: React.ReactNode }
    }>) => (
      <div>
        {children}
        <button onClick={applyBtnProps?.onClick}>
          {applyBtnProps?.children}
        </button>
        <button onClick={clearBtnProps?.onClick}>
          {clearBtnProps?.children}
        </button>
      </div>
    ),
  }
})

import MyAccountQuotesFilterSlider from '../../../src/components/account/quotes/MyAccountListQuotes/MyAccountQuotesFilterSlider/MyAccountQuotesFilterSlider'
import { getAllFacets } from '../../../src/components/account/quotes/MyAccountListQuotes/quoteFilters'

const originalLocation = window.location

function stubLocation(search = '') {
  Object.defineProperty(window, 'location', {
    configurable: true,
    value: { ...originalLocation, search, href: '' },
  })
}

function baseProps(overrides: Record<string, unknown> = {}) {
  return {
    facets: getAllFacets({
      page: 1,
      status: [],
      createdAtFrom: '',
      createdAtTo: '',
      expiresAtFrom: '',
      expiresAtTo: '',
      label: '',
    }),
    testId: 'test-filter-slider',
    dispatch: vi.fn(),
    expanded: false,
    selected: [],
    title: 'Filters',
    clearButtonLabel: 'Clear All',
    applyButtonLabel: 'View Results',
    ...overrides,
  }
}

describe('MyAccountQuotesFilterSlider', () => {
  beforeEach(() => {
    stubLocation()
  })

  afterEach(() => {
    vi.clearAllMocks()
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: originalLocation,
    })
  })

  it('navigates with the selected status params on apply', () => {
    render(
      <MyAccountQuotesFilterSlider
        {...(baseProps({
          selected: [{ key: 'status', value: 'Draft' }],
        }) as any)}
      />
    )

    fireEvent.click(screen.getByText('View Results'))

    expect(window.location.href).toBe('/pvt/account/quotes?status=Draft')
  })

  it('navigates with the created date range params on apply', () => {
    render(<MyAccountQuotesFilterSlider {...(baseProps() as any)} />)

    fireEvent.change(screen.getAllByLabelText('From')[0], {
      target: { value: '2026-01-01' },
    })
    fireEvent.change(screen.getAllByLabelText('To')[0], {
      target: { value: '2026-01-31' },
    })

    fireEvent.click(screen.getByText('View Results'))

    expect(window.location.href).toBe(
      '/pvt/account/quotes?createdAtFrom=2026-01-01&createdAtTo=2026-01-31'
    )
  })

  it('preserves an existing label param when applying filters', () => {
    stubLocation('?label=hello')

    render(
      <MyAccountQuotesFilterSlider
        {...(baseProps({
          selected: [{ key: 'status', value: 'Draft' }],
        }) as any)}
      />
    )

    fireEvent.click(screen.getByText('View Results'))

    expect(window.location.href).toBe(
      '/pvt/account/quotes?label=hello&status=Draft'
    )
  })

  it('navigates with no query string when no filters are applied', () => {
    render(<MyAccountQuotesFilterSlider {...(baseProps() as any)} />)

    fireEvent.click(screen.getByText('View Results'))

    expect(window.location.href).toBe('/pvt/account/quotes')
  })

  it('clears the created/expiry date refs and dispatches an empty facet selection on clear', () => {
    const dispatch = vi.fn()
    render(
      <MyAccountQuotesFilterSlider {...(baseProps({ dispatch }) as any)} />
    )

    fireEvent.click(screen.getByText('Clear All'))

    expect(dispatch).toHaveBeenCalledWith({
      type: 'selectFacets',
      payload: [],
    })
  })
})
