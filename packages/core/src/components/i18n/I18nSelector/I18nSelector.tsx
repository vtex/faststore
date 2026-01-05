import type { RefObject, SelectHTMLAttributes } from 'react'
import { useMemo, useState } from 'react'

import {
  SlideOver,
  SlideOverHeader,
  Button as UIButton,
  Popover as UIPopover,
  SelectField as UISelectField,
  useFadeEffect,
} from '@faststore/ui'

import storeConfig from 'discovery.config'

import useScreenResize from 'src/sdk/ui/useScreenResize'
import styles from './section.module.scss'

type SelectValue = string
type SelectOptions = Record<string, string>

interface I18nSelectorContentProps {
  selectedLanguage: SelectValue
  selectedCurrency: SelectValue
  onLanguageChange: SelectHTMLAttributes<HTMLSelectElement>['onChange']
  onCurrencyChange: SelectHTMLAttributes<HTMLSelectElement>['onChange']
  languageLabel: string
  currencyLabel: string
  description: string
  saveLabel: string
  languages: SelectOptions
  currencies: SelectOptions
  /**
   * When true, renders the Save button inside the content.
   * Used by the desktop (Popover) variation.
   */
  showSaveButton?: boolean
  onSave?: () => void
}

interface I18nSelectorProps {
  /**
   * Controls whether the selector is open or closed.
   */
  isOpen: boolean
  /**
   * Called when the selector should be closed
   * (outside click, close button or save action).
   */
  onClose: () => void
  /**
   * Reference element used to position the Popover on desktop.
   */
  triggerRef?: RefObject<HTMLElement>
  /**
   * Optional callback fired when the user confirms the Save action.
   */
  onSave?: (params: { language: SelectValue; currency: SelectValue }) => void
  /**
   * UI copy texts.
   */
  title: string
  languageLabel: string
  currencyLabel: string
  description: string
  saveLabel: string
  /**
   * Initial selected values (optional).
   */
  defaultLanguage?: SelectValue
  defaultCurrency?: SelectValue
}

const I18nSelectorContent = ({
  selectedLanguage,
  selectedCurrency,
  onLanguageChange,
  onCurrencyChange,
  languageLabel,
  currencyLabel,
  description,
  saveLabel,
  languages,
  currencies,
  showSaveButton = false,
  onSave,
}: I18nSelectorContentProps) => {
  return (
    <div data-fs-i18n-selector-content>
      <UISelectField
        id="i18n-selector-language"
        label={languageLabel}
        options={languages}
        value={selectedLanguage}
        onChange={onLanguageChange}
      />

      <UISelectField
        id="i18n-selector-currency"
        label={currencyLabel}
        options={currencies}
        value={selectedCurrency}
        onChange={onCurrencyChange}
      />

      <p data-fs-i18n-selector-description>{description}</p>

      {showSaveButton && onSave && (
        <div data-fs-i18n-selector-actions>
          <UIButton variant="primary" onClick={onSave}>
            {saveLabel}
          </UIButton>
        </div>
      )}
    </div>
  )
}

function I18nSelector({
  isOpen,
  onClose,
  triggerRef,
  onSave,
  title,
  languageLabel,
  currencyLabel,
  description,
  saveLabel,
  defaultLanguage,
  defaultCurrency,
}: I18nSelectorProps) {
  const { loading, isDesktop } = useScreenResize()
  const { fade, fadeOut } = useFadeEffect()

  const languages = useMemo(() => {
    const localesConfig = storeConfig.localization?.locales
    if (!localesConfig) return {}

    return Object.keys(localesConfig).reduce<Record<string, string>>(
      (acc, key) => {
        const locale = localesConfig[key]
        if (locale?.name) {
          acc[key] = locale.name
        }
        return acc
      },
      {}
    )
  }, [])

  const currencies = useMemo(() => {
    const currenciesConfig = storeConfig.localization?.currencies
    if (!currenciesConfig) return {}

    return Object.keys(currenciesConfig).reduce<Record<string, string>>(
      (acc, key) => {
        const currency = currenciesConfig[key]
        if (currency?.code) {
          acc[key] = currency.code
        }
        return acc
      },
      {}
    )
  }, [])

  const [selectedLanguage, setSelectedLanguage] = useState<SelectValue>(() => {
    if (defaultLanguage && languages[defaultLanguage]) {
      return defaultLanguage
    }

    const [firstLanguage] = Object.keys(languages)

    return firstLanguage ?? ''
  })

  const [selectedCurrency, setSelectedCurrency] = useState<SelectValue>(() => {
    if (defaultCurrency && currencies[defaultCurrency]) {
      return defaultCurrency
    }

    const [firstCurrency] = Object.keys(currencies)

    return firstCurrency ?? ''
  })

  const handleSave = () => {
    onSave?.({
      language: selectedLanguage,
      currency: selectedCurrency,
    })

    onClose()
  }

  const isDesktopDevice = useMemo(
    () => !loading && Boolean(isDesktop),
    [loading, isDesktop]
  )

  if (loading) {
    return null
  }

  if (isDesktopDevice) {
    return (
      <UIPopover
        isOpen={isOpen}
        placement="bottom-start"
        triggerRef={triggerRef}
        onDismiss={onClose}
        enablePortal
        data-fs-i18n-selector
        wrapperProps={{
          className: `${styles.common} ${styles.desktop}`,
        }}
        content={
          <I18nSelectorContent
            selectedLanguage={selectedLanguage}
            selectedCurrency={selectedCurrency}
            onLanguageChange={(event) =>
              setSelectedLanguage(event.currentTarget.value)
            }
            onCurrencyChange={(event) =>
              setSelectedCurrency(event.currentTarget.value)
            }
            languageLabel={languageLabel}
            currencyLabel={currencyLabel}
            description={description}
            saveLabel={saveLabel}
            languages={languages}
            currencies={currencies}
            showSaveButton
            onSave={handleSave}
          />
        }
      />
    )
  }

  return (
    <SlideOver
      data-fs-i18n-selector
      data-fs-i18n-selector-mobile
      fade={fade}
      onDismiss={fadeOut}
      onTransitionEnd={() => fade === 'out' && onClose()}
      isOpen={isOpen}
      size="partial"
      direction="bottomSide"
      overlayProps={{
        className: `${styles.common} ${styles.mobile}`,
      }}
    >
      <SlideOverHeader onClose={fadeOut}>
        <h2 data-fs-i18n-selector-title>{title}</h2>
      </SlideOverHeader>
      <div data-fs-i18n-selector-body>
        <I18nSelectorContent
          selectedLanguage={selectedLanguage}
          selectedCurrency={selectedCurrency}
          onLanguageChange={(event) =>
            setSelectedLanguage(event.currentTarget.value)
          }
          onCurrencyChange={(event) =>
            setSelectedCurrency(event.currentTarget.value)
          }
          languageLabel={languageLabel}
          currencyLabel={currencyLabel}
          description={description}
          saveLabel={saveLabel}
          languages={languages}
          currencies={currencies}
        />
      </div>
      <footer data-fs-i18n-selector-footer>
        <UIButton variant="primary" onClick={handleSave}>
          {saveLabel}
        </UIButton>
      </footer>
    </SlideOver>
  )
}

export default I18nSelector
