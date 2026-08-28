import '@testing-library/jest-dom/vitest'
import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

const mockUseBindingSelector = vi.hoisted(() =>
  vi.fn(() => ({
    languages: { 'en-US': 'English' },
    currencies: { USD: 'USD' },
    localeCode: 'en-US',
    currencyCode: 'USD',
    setLocaleCode: vi.fn(),
    setCurrencyCode: vi.fn(),
    save: vi.fn(),
    reset: vi.fn(),
    isSaveEnabled: true,
    error: null,
  }))
)

vi.mock('src/sdk/localization', () => ({
  useBindingSelector: mockUseBindingSelector,
}))

vi.mock('src/sdk/session', () => ({
  useSession: () => ({ locale: 'pt-BR', currency: { code: 'BRL' } }),
}))

vi.mock('discovery.config', async (importOriginal) => {
  const original = await importOriginal<{ default: Record<string, unknown> }>()

  return { default: { ...original.default, localization: { enabled: true } } }
})

import LocalizationButton from 'src/components/ui/LocalizationButton'
import { LocalizedProductProvider } from 'src/sdk/localization/LocalizedProductContext'

const OTHER_LOCALES = [
  { locale: 'en-US', slug: 'roshe-tenis-76' },
  { locale: 'pt-BR', slug: 'tenis-roshe-76' },
]

afterEach(() => {
  cleanup()
  mockUseBindingSelector.mockClear()
})

describe('LocalizationButton', () => {
  it('forwards both slug sources from the product context to the selector', () => {
    render(
      <LocalizedProductProvider
        otherLocales={OTHER_LOCALES}
        defaultLocaleSlug="roshe-tenis-76"
      >
        <LocalizationButton />
      </LocalizedProductProvider>
    )

    expect(mockUseBindingSelector).toHaveBeenCalledWith(
      OTHER_LOCALES,
      '/p',
      'roshe-tenis-76'
    )
  })

  it('passes no default-locale slug on collection pages', () => {
    render(
      <LocalizedProductProvider otherLocales={OTHER_LOCALES} urlSuffix="">
        <LocalizationButton />
      </LocalizedProductProvider>
    )

    expect(mockUseBindingSelector).toHaveBeenCalledWith(
      OTHER_LOCALES,
      '',
      undefined
    )
  })

  it('falls back to product-page defaults outside a provider', () => {
    render(<LocalizationButton />)

    expect(mockUseBindingSelector).toHaveBeenCalledWith(
      undefined,
      '/p',
      undefined
    )
  })

  it('labels the button with the session locale and currency', () => {
    render(<LocalizationButton />)

    expect(screen.getByText('PT')).toBeInTheDocument()
    expect(screen.getByText('BRL')).toBeInTheDocument()
  })
})
