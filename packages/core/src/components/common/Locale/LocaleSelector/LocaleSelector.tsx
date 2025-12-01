// AI GENERATED CODE
import { Button as UIButton, Icon as UIIcon, useUI } from '@faststore/ui'
import { useRouter } from 'next/router'
import { useMemo, useRef, useState } from 'react'

import { useSession } from 'src/sdk/session'
import { localizationStore } from 'src/sdk/session/useSessionSettings'
import localesData from '../../../../../locales-test.json'

import styles from './section.module.scss'

export interface LocaleSelectorProps {
  /**
   * Icon to display next to locale code
   */
  icon?: {
    name: string
    alt: string
  }
  /**
   * Aria label for the locale selector button
   */
  buttonAriaLabel?: string
  /**
   * Mode: 'locale' for single dropdown, 'language-currency' for two dropdowns
   */
  mode?: 'locale' | 'language-currency'
  /**
   * Label for language dropdown (mode: language-currency)
   */
  languageLabel?: string
  /**
   * Label for currency dropdown (mode: language-currency)
   */
  currencyLabel?: string
  /**
   * Text for apply button (mode: language-currency)
   */
  applyButtonText?: string
  /**
   * Message to show when combination is invalid
   */
  disabledMessage?: string
}

function LocaleSelector({
  icon,
  buttonAriaLabel = 'Select language and region',
  mode = 'locale',
  languageLabel = 'Language',
  currencyLabel = 'Currency',
  applyButtonText = 'Apply',
  disabledMessage,
}: LocaleSelectorProps) {
  const router = useRouter()
  const buttonRef = useRef<HTMLButtonElement>(null)
  const { popover, openPopover, closePopover } = useUI()
  const { currency: currentCurrency } = useSession()

  // Get current locale from router
  const currentLocale = router.locale ?? localesData.defaultLocale

  // Get available locales from the store
  const { locales } = localizationStore.read()

  // State for language-currency mode
  const [selectedLanguage, setSelectedLanguage] = useState(currentLocale)
  const [selectedCurrency, setSelectedCurrency] = useState(
    currentCurrency?.code
  )

  // Find matching locale for language-currency combination
  const findMatchingLocale = useMemo(() => {
    return (language: string, currency: string) => {
      const allLocales = Object.values(localesData.locales) as Array<{
        code: string
        languageCode: string
        bindings: Array<{ currencyCode: string }>
      }>

      // Try exact match first
      const exactMatch = allLocales.find(
        (l) =>
          l.code === language &&
          l.bindings.some((b) => b.currencyCode === currency)
      )
      if (exactMatch) return exactMatch.code

      // Try same languageCode + currency
      const languageCode = language.split('-')[0]
      const languageMatch = allLocales.find(
        (l) =>
          l.languageCode === languageCode &&
          l.bindings.some((b) => b.currencyCode === currency)
      )

      return languageMatch?.code || null
    }
  }, [])

  // Check if current selection is valid
  const matchingLocale = useMemo(() => {
    if (mode === 'language-currency') {
      return findMatchingLocale(selectedLanguage, selectedCurrency)
    }
    return null
  }, [mode, selectedLanguage, selectedCurrency, findMatchingLocale])

  const isApplyEnabled = mode === 'language-currency' && matchingLocale !== null

  // Get available languages and currencies
  const availableLanguages = useMemo(() => {
    return Object.values(localesData.locales as any).map((l: any) => ({
      code: l.code,
      name: l.name || l.languageName,
    }))
  }, [])

  const availableCurrencies = useMemo(() => {
    return Object.values(localesData.currencies as any).map((c: any) => ({
      code: c.code,
      name: c.name,
      symbol: c.symbol,
    }))
  }, [])

  const handleLocaleChange = async (newLocale: string) => {
    if (newLocale === currentLocale) {
      closePopover()
      return
    }

    // Pre-update session stores BEFORE navigation to prevent flash
    // This ensures currency/salesChannel are updated synchronously
    const localeConfig = (localesData.locales as any)[newLocale]
    if (localeConfig) {
      const { sessionStore } = await import('src/sdk/session')
      const currentSession = sessionStore.read()

      // Get the first binding
      const binding = localeConfig.bindings?.[0]
      const currencyCode = binding?.currencyCode
      const currencyInfo = (localesData.currencies as any)[currencyCode]

      sessionStore.set({
        ...currentSession,
        locale: newLocale,
        currency: {
          code: currencyCode,
          symbol: currencyInfo?.symbol,
        },
        channel: JSON.stringify({
          salesChannel: binding?.salesChannel,
        }),
      })
    }

    // Use Next.js router to change locale
    // This will trigger getStaticProps to refetch with new locale
    await router.push(router.asPath, router.asPath, { locale: newLocale })
    closePopover()
  }

  const handleTogglePopover = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (popover.isOpen && popover.triggerRef === buttonRef) {
      closePopover()
    } else if (!popover.isOpen) {
      openPopover({
        isOpen: true,
        triggerRef: buttonRef,
      })
    }
  }

  const handleApply = async () => {
    if (!matchingLocale) return

    // Pre-update session stores BEFORE navigation
    const localeConfig = (localesData.locales as any)[matchingLocale]
    if (localeConfig) {
      const { sessionStore } = await import('src/sdk/session')
      const currentSession = sessionStore.read()

      // Get the first binding
      const binding = localeConfig.bindings?.[0]
      const currencyCode = binding?.currencyCode
      const currencyInfo = (localesData.currencies as any)[currencyCode]

      sessionStore.set({
        ...currentSession,
        locale: matchingLocale,
        currency: {
          code: currencyCode,
          symbol: currencyInfo?.symbol,
        },
        channel: JSON.stringify({
          salesChannel: binding?.salesChannel,
        }),
      })
    }

    // Navigate to new locale
    await router.push(router.asPath, router.asPath, { locale: matchingLocale })
    closePopover()
  }

  // Build locale list content (original mode)
  const LocaleListContent = (
    <div data-fs-locale-selector-list>
      {locales.map((localeCode) => {
        const localeConfig = (localesData.locales as any)[localeCode]
        const isCurrentLocale = localeCode === currentLocale
        const displayName = localeConfig?.languageName || localeCode

        return (
          <button
            key={localeCode}
            data-fs-locale-selector-option
            data-fs-locale-selector-option-selected={isCurrentLocale}
            onClick={() => handleLocaleChange(localeCode)}
            type="button"
            aria-current={isCurrentLocale ? 'true' : 'false'}
          >
            <span data-fs-locale-selector-option-name>{displayName}</span>
            <span data-fs-locale-selector-option-code>({localeCode})</span>
            {isCurrentLocale && (
              <UIIcon
                name="Check"
                width={16}
                height={16}
                aria-label="Current locale"
              />
            )}
          </button>
        )
      })}
    </div>
  )

  // Build language-currency content (new mode)
  const LanguageCurrencyContent = (
    <div data-fs-language-currency-selector>
      <div data-fs-language-currency-row>
        <label data-fs-language-currency-label>
          {languageLabel}
          <select
            data-fs-language-currency-select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
          >
            {availableLanguages.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div data-fs-language-currency-row>
        <label data-fs-language-currency-label>
          {currencyLabel}
          <select
            data-fs-language-currency-select
            value={selectedCurrency}
            onChange={(e) => setSelectedCurrency(e.target.value)}
          >
            {availableCurrencies.map((curr) => (
              <option key={curr.code} value={curr.code}>
                {curr.name} ({curr.symbol})
              </option>
            ))}
          </select>
        </label>
      </div>

      {!isApplyEnabled && disabledMessage && (
        <div data-fs-language-currency-warning>{disabledMessage}</div>
      )}

      <UIButton
        data-fs-language-currency-apply
        onClick={handleApply}
        disabled={!isApplyEnabled}
        variant="primary"
        size="small"
      >
        {applyButtonText}
      </UIButton>
    </div>
  )

  return (
    <div
      className={`${styles.section} section-locale-selector`}
      data-mode={mode}
    >
      <UIButton
        ref={buttonRef}
        data-fs-locale-selector-button
        onClick={handleTogglePopover}
        variant="tertiary"
        size="small"
        aria-label={buttonAriaLabel}
        aria-expanded={popover.isOpen && popover.triggerRef === buttonRef}
        aria-haspopup="true"
      >
        {icon && (
          <UIIcon
            name={icon.name}
            width={18}
            height={18}
            aria-label={icon.alt}
          />
        )}
        <span data-fs-locale-selector-current>
          {mode === 'locale'
            ? currentLocale
            : `${currentLocale}/${currentCurrency?.code}`}
        </span>
        <UIIcon name="CaretDown" width={16} height={16} aria-hidden="true" />
      </UIButton>

      {popover.isOpen && popover.triggerRef === buttonRef && (
        <div
          data-fs-locale-selector-popover
          className={styles.popover}
          role="menu"
          aria-label={
            mode === 'locale'
              ? 'Available locales'
              : 'Language and currency selector'
          }
        >
          {mode === 'locale' ? LocaleListContent : LanguageCurrencyContent}
        </div>
      )}
    </div>
  )
}

LocaleSelector.$componentKey = 'LocaleSelector'

export default LocaleSelector
