import type { RefObject } from 'react'
import { useMemo } from 'react'

import {
  SlideOver,
  SlideOverHeader,
  Button as UIButton,
  Icon as UIIcon,
  Popover as UIPopover,
  SelectField as UISelectField,
  useFadeEffect,
} from '@faststore/ui'

import type { BindingSelectorError } from 'src/sdk/i18n'
import useScreenResize from 'src/sdk/ui/useScreenResize'
import styles from './section.module.scss'

type SelectValue = string
type SelectOptions = Record<string, string>

interface I18nSelectorContentProps {
  /** Language options - Record where key is locale code (e.g., "pt-BR") and value is language name (e.g., "Português") */
  languages: SelectOptions
  /** Currency options - Record where key is currency code and value is currency code */
  currencies: SelectOptions
  /** Currently selected locale code (e.g., "pt-BR") */
  localeCode: SelectValue
  /** Currently selected currency code (e.g., "BRL") */
  currencyCode: SelectValue
  /** Callback when locale code changes - receives locale code */
  onLocaleChange: (code: string) => void
  /** Callback when currency code changes - receives currency code */
  onCurrencyChange: (code: string) => void
  languageLabel: string
  currencyLabel: string
  description: string
  saveLabel: string
  /**
   * When true, renders the Save button inside the content.
   * Used by the desktop (Popover) variation.
   */
  showSaveButton?: boolean
  onSave?: () => void
  /** Whether the save button should be enabled */
  canSave?: boolean
  /** Error message element to display */
  errorMessage?: React.ReactNode
}

interface LocalizationSelectorErrorMessages {
  noBindingFound?: string
  invalidUrl?: string
  noCurrencies?: string
  defaultError?: string
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
   * Language options from useBindingSelector hook.
   * Record where key is locale code (e.g., "pt-BR") and value is language name (e.g., "Português")
   */
  languages: SelectOptions
  /**
   * Currency options from useBindingSelector hook.
   */
  currencies: SelectOptions
  /**
   * Currently selected locale code from useBindingSelector hook (e.g., "pt-BR")
   */
  localeCode: SelectValue | null
  /**
   * Currently selected currency code from useBindingSelector hook (e.g., "BRL")
   */
  currencyCode: SelectValue | null
  /**
   * Callback when locale code changes - receives locale code and passes to hook's setLocaleCode
   */
  onLocaleChange: (code: string) => void
  /**
   * Callback when currency code changes - passes to hook's setCurrencyCode
   */
  onCurrencyChange: (code: string) => void
  /**
   * Callback when save is triggered - passes to hook's save
   */
  onSave: () => void
  /**
   * Whether save is enabled from useBindingSelector hook
   */
  canSave: boolean
  /**
   * Error state from useBindingSelector hook
   */
  error: BindingSelectorError | null
  /**
   * Title displayed in mobile SlideOver header
   */
  title: string
  languageLabel: string
  currencyLabel: string
  /**
   * Description text
   */
  description: string
  saveLabel: string
  /**
   * Custom error messages from CMS
   */
  errorMessages?: LocalizationSelectorErrorMessages
}

const I18nSelectorContent = ({
  languages,
  currencies,
  localeCode,
  currencyCode,
  onLocaleChange,
  onCurrencyChange,
  languageLabel,
  currencyLabel,
  description,
  saveLabel,
  showSaveButton = false,
  onSave,
  canSave = true,
  errorMessage,
}: I18nSelectorContentProps) => {
  return (
    <div data-fs-i18n-selector-content>
      <UISelectField
        id="i18n-selector-language"
        label={languageLabel}
        options={languages}
        value={localeCode}
        onChange={(event) => onLocaleChange(event.currentTarget.value)}
      />

      <UISelectField
        id="i18n-selector-currency"
        label={currencyLabel}
        options={currencies}
        value={currencyCode}
        onChange={(event) => onCurrencyChange(event.currentTarget.value)}
        disabled={Object.keys(currencies).length === 0}
      />

      <p data-fs-i18n-selector-description>{description}</p>

      {errorMessage}

      {showSaveButton && onSave && (
        <div data-fs-i18n-selector-actions>
          <UIButton variant="primary" onClick={onSave} disabled={!canSave}>
            {saveLabel}
          </UIButton>
        </div>
      )}
    </div>
  )
}

/**
 * Helper function to get error message for display
 */
function getErrorMessage(
  error: BindingSelectorError,
  errorMessages?: LocalizationSelectorErrorMessages
): string {
  return errorMessages?.[error.type] ?? errorMessages?.defaultError ?? ''
}

function I18nSelector({
  isOpen,
  onClose,
  triggerRef,
  languages,
  currencies,
  localeCode,
  currencyCode,
  onLocaleChange,
  onCurrencyChange,
  onSave,
  canSave,
  error,
  title,
  languageLabel,
  currencyLabel,
  description,
  saveLabel,
  errorMessages,
}: I18nSelectorProps) {
  const { loading, isDesktop } = useScreenResize()
  const { fade, fadeOut } = useFadeEffect()

  const handleSave = () => {
    onSave()
  }

  const isDesktopDevice = useMemo(
    () => !loading && Boolean(isDesktop),
    [loading, isDesktop]
  )

  if (loading) {
    return null
  }

  // Error display
  const errorMessage = error && (
    <div data-fs-localization-selector-error role="alert">
      <UIIcon name="Warning" width={18} height={18} />
      <span>{getErrorMessage(error, errorMessages)}</span>
    </div>
  )

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
            languages={languages}
            currencies={currencies}
            localeCode={localeCode ?? ''}
            currencyCode={currencyCode ?? ''}
            onLocaleChange={onLocaleChange}
            onCurrencyChange={onCurrencyChange}
            languageLabel={languageLabel}
            currencyLabel={currencyLabel}
            description={description}
            saveLabel={saveLabel}
            showSaveButton
            onSave={handleSave}
            canSave={canSave}
            errorMessage={errorMessage}
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
          languages={languages}
          currencies={currencies}
          localeCode={localeCode ?? ''}
          currencyCode={currencyCode ?? ''}
          onLocaleChange={onLocaleChange}
          onCurrencyChange={onCurrencyChange}
          languageLabel={languageLabel}
          currencyLabel={currencyLabel}
          description={description}
          saveLabel={saveLabel}
          errorMessage={errorMessage}
        />
      </div>
      <footer data-fs-i18n-selector-footer>
        <UIButton variant="primary" onClick={handleSave} disabled={!canSave}>
          {saveLabel}
        </UIButton>
      </footer>
    </SlideOver>
  )
}

export default I18nSelector
