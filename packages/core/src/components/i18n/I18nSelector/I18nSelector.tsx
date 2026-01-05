import type { RefObject, SelectHTMLAttributes } from 'react'
import { useMemo, useState } from 'react'

import {
  Button as UIButton,
  Modal as UIModal,
  ModalBody as UIModalBody,
  ModalFooter as UIModalFooter,
  ModalHeader as UIModalHeader,
  Popover as UIPopover,
  SelectField as UISelectField,
} from '@faststore/ui'

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
   * Available language and currency options.
   */
  languages: SelectOptions
  currencies: SelectOptions
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
  languages,
  currencies,
  title,
  languageLabel,
  currencyLabel,
  description,
  saveLabel,
  defaultLanguage,
  defaultCurrency,
}: I18nSelectorProps) {
  const { loading, isMobile } = useScreenResize()

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

  const isMobileDevice = useMemo(
    () => !loading && Boolean(isMobile),
    [loading, isMobile]
  )

  if (!isOpen || loading) {
    return null
  }

  if (isMobileDevice) {
    return (
      <UIModal
        isOpen={isOpen}
        data-fs-i18n-selector
        onDismiss={onClose}
        overlayProps={{
          className: `${styles.common} ${styles.mobile}`,
        }}
      >
        <UIModalHeader title={title} onClose={onClose} />
        <UIModalBody>
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
          <UIButton variant="primary" onClick={handleSave}>
            {saveLabel}
          </UIButton>
        </UIModalBody>
      </UIModal>
    )
  }

  return (
    <div className={`${styles.common} ${styles.desktop}`}>
      <UIPopover
        isOpen={isOpen}
        placement="bottom-start"
        triggerRef={triggerRef}
        onDismiss={onClose}
        offsetTop={undefined}
        data-fs-i18n-selector
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
    </div>
  )
}

export default I18nSelector
