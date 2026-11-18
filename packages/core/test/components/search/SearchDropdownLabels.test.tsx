/**
 * @vitest-environment jsdom
 */

import React from 'react'
import { act, fireEvent, render, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

const dropdownProps = vi.hoisted(() => ({
  current: null as Record<string, unknown> | null,
}))

// Render the lazy-loaded input field as a plain <input> so the dropdown can be
// opened through `onFocus`, and so leaked props show up as DOM attributes.
vi.mock('next/dynamic', () => ({
  default: () =>
    function InputField({
      onFocus,
      ...props
    }: React.InputHTMLAttributes<HTMLInputElement>) {
      const domProps = Object.fromEntries(
        Object.entries(props).filter(
          ([, value]) => typeof value === 'string' || value === undefined
        )
      )
      return (
        <input
          data-testid="search-field"
          readOnly
          onFocus={onFocus}
          {...domProps}
        />
      )
    },
}))

vi.mock('next/router', () => ({
  useRouter: vi.fn(() => ({ push: vi.fn() })),
}))

vi.mock('src/components/search/SearchDropdown', () => ({
  default: (props: Record<string, unknown>) => {
    dropdownProps.current = props
    return null
  },
}))

vi.mock('discovery.config', () => ({
  __esModule: true,
  default: { localization: { enabled: false, defaultLocale: 'en-US' } },
}))

vi.mock('@faststore/ui', () => {
  const stub =
    (name: string) =>
    ({
      children,
      ...props
    }: React.PropsWithChildren<Record<string, unknown>>) =>
      React.createElement('div', { 'data-ui': name, ...props }, children)

  return {
    SearchInput: React.forwardRef(stub('SearchInput')),
    FileUploadCard: stub('FileUploadCard'),
    QuickOrderDrawer: stub('QuickOrderDrawer'),
    QuickOrderDrawerFooter: stub('QuickOrderDrawerFooter'),
    QuickOrderDrawerHeader: stub('QuickOrderDrawerHeader'),
    QuickOrderDrawerProducts: stub('QuickOrderDrawerProducts'),
    Icon: stub('Icon'),
    IconButton: stub('IconButton'),
    useOnClickOutside: vi.fn(),
    FileUploadErrorType: {},
  }
})

vi.mock('src/sdk/search/useSearchHistory', () => ({
  default: vi.fn(() => ({ addToSearchHistory: vi.fn(), searchHistory: [] })),
}))

vi.mock('src/sdk/search/useSuggestions', () => ({
  default: vi.fn(() => ({ terms: [], products: [] })),
}))

vi.mock('src/sdk/cart', () => ({
  cartStore: { addItem: vi.fn() },
}))

vi.mock('src/sdk/product/useFormattedPrice', () => ({
  usePriceFormatter: vi.fn(() => (price: number) => `$${price}`),
}))

vi.mock('src/sdk/search/formatSearchPath', () => ({
  formatSearchPath: vi.fn((term: string) => `/s?q=${term}`),
}))

vi.mock('src/utils/utilities', () => ({
  formatFileName: vi.fn((n: string) => n),
  formatFileSize: vi.fn((s: number) => `${s}B`),
}))

vi.mock('src/sdk/auth', () => ({
  useAuth: vi.fn(() => ({ isAuthenticated: false })),
}))

vi.mock('src/sdk/orderEntry/useOrderEntry', () => ({
  useOrderEntry: vi.fn(() => ({
    submitFile: vi.fn(),
    status: null,
    isUploading: false,
    isProcessing: false,
    error: null,
    reset: vi.fn(),
  })),
}))

vi.mock('src/sdk/orderEntry/useOrderFormItems', () => ({
  useOrderFormItems: vi.fn(() => ({
    fetchOrderFormItems: vi.fn(),
    items: null,
    reset: vi.fn(),
  })),
}))

import SearchInput from '../../../src/components/search/SearchInput/SearchInput'

afterEach(() => {
  dropdownProps.current = null
})

const labels = {
  searchHistoryTitle: 'Histórico',
  searchHistoryClearLabel: 'Limpar histórico',
  searchTopTitle: 'Mais buscados',
  searchProductsTitle: 'Produtos sugeridos',
}

describe('SearchInput dropdown labels', () => {
  it('forwards the CMS labels to the SearchDropdown', async () => {
    const { getByTestId } = render(
      <React.Suspense fallback={null}>
        <SearchInput {...labels} />
      </React.Suspense>
    )

    await act(async () => {
      fireEvent.focus(getByTestId('search-field'))
    })

    await waitFor(() => {
      expect(dropdownProps.current).toMatchObject(labels)
    })
  })

  it('does not leak the CMS labels to the input element', () => {
    const { getByTestId } = render(
      <React.Suspense fallback={null}>
        <SearchInput {...labels} />
      </React.Suspense>
    )

    const field = getByTestId('search-field')
    for (const name of Object.keys(labels)) {
      expect(field.hasAttribute(name)).toBe(false)
    }
  })
})
