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

import type { BindingSelectorError } from 'src/sdk/localization'
import useScreenResize from 'src/sdk/ui/useScreenResize'
import styles from './section.module.scss'

type SelectValue = string
type SelectOptions = Record<string, string>

interface LocalizationSelectorContentProps {
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
  isSaveEnabled?: boolean
  /** Error message element to display */
  errorMessage?: React.ReactNode
}

interface LocalizationSelectorErrorMessages {
  noBindingFound?: string
  invalidUrl?: string
  noCurrencies?: string
  defaultError?: string
}

interface LocalizationSelectorProps {
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
  isSaveEnabled: boolean
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

const LocalizationSelectorContent = ({
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
  isSaveEnabled = true,
  errorMessage,
}: LocalizationSelectorContentProps) => {
  return (
    <div data-fs-localization-selector-content>
      <UISelectField
        id="localization-selector-language"
        label={languageLabel}
        options={languages}
        value={localeCode}
        onChange={(event) => onLocaleChange(event.currentTarget.value)}
      />

      <UISelectField
        id="localization-selector-currency"
        label={currencyLabel}
        options={currencies}
        value={currencyCode}
        onChange={(event) => onCurrencyChange(event.currentTarget.value)}
        disabled={Object.keys(currencies).length === 0}
      />

      <p data-fs-localization-selector-description>{description}</p>

      {errorMessage}

      {showSaveButton && onSave && (
        <div data-fs-localization-selector-actions>
          <UIButton
            variant="primary"
            onClick={onSave}
            disabled={!isSaveEnabled}
          >
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

function LocalizationSelector({
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
  isSaveEnabled,
  error,
  title,
  languageLabel,
  currencyLabel,
  description,
  saveLabel,
  errorMessages,
}: LocalizationSelectorProps) {
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
        data-fs-localization-selector
        wrapperProps={{
          className: `${styles.common} ${styles.desktop}`,
        }}
        content={
          <LocalizationSelectorContent
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
            isSaveEnabled={isSaveEnabled}
            errorMessage={errorMessage}
          />
        }
      />
    )
  }

  return (
    <SlideOver
      data-fs-localization-selector
      data-fs-localization-selector-mobile
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
        <h2 data-fs-localization-selector-title>{title}</h2>
      </SlideOverHeader>
      <div data-fs-localization-selector-body>
        <LocalizationSelectorContent
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
      <footer data-fs-localization-selector-footer>
        <UIButton
          variant="primary"
          onClick={handleSave}
          disabled={!isSaveEnabled}
        >
          {saveLabel}
        </UIButton>
      </footer>
    </SlideOver>
  )
}

export default LocalizationSelector
