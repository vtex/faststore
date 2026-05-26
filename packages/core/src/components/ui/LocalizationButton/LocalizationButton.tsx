import { useRef, useState } from 'react'

import type { PopoverProps } from '@faststore/ui'
import { Icon, Button as UIButton } from '@faststore/ui'

import storeConfig from 'discovery.config'
import LocalizationSelector from 'src/components/localization/LocalizationSelector'
import { useBindingSelector } from 'src/sdk/localization'
import { useLocalizedProduct } from 'src/sdk/localization/LocalizedProductContext'
import { useSession } from 'src/sdk/session'

export interface LocalizationButtonErrorMessages {
  noBindingFound?: string
  invalidUrl?: string
  noCurrencies?: string
  defaultError?: string
}

export interface LocalizationButtonProps {
  icon?: string
  title?: string
  languageLabel?: string
  currencyLabel?: string
  description?: string
  saveLabel?: string
  ariaLabel?: string
  errorMessages?: LocalizationButtonErrorMessages
  popoverPlacement?: PopoverProps['placement']
}

const LocalizationButton = ({
  icon,
  title,
  languageLabel,
  currencyLabel,
  description,
  saveLabel,
  ariaLabel,
  errorMessages,
  popoverPlacement,
}: LocalizationButtonProps) => {
  const [isSelectorOpen, setIsSelectorOpen] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)

  const otherLocales = useLocalizedProduct()?.otherLocales ?? undefined

  const {
    languages,
    currencies,
    localeCode,
    currencyCode,
    setLocaleCode,
    setCurrencyCode,
    save,
    reset,
    isSaveEnabled,
    error,
  } = useBindingSelector(otherLocales)

  const { locale: sessionLocale, currency: sessionCurrency } = useSession()

  // Don't render if localization is not enabled
  if (!storeConfig.localization?.enabled) {
    return null
  }

  // Extract language code from session locale for display (e.g., "pt-BR" -> "PT")
  const localeText = sessionLocale?.split('-')[0].toUpperCase() ?? ''
  const currencyText = sessionCurrency?.code ?? ''

  return (
    <>
      <UIButton
        ref={buttonRef}
        data-fs-localization-button
        icon={
          icon ? (
            <Icon name={icon} width={16} height={16} weight="bold" />
          ) : undefined
        }
        iconPosition="left"
        variant="tertiary"
        onClick={() => {
          setIsSelectorOpen(!isSelectorOpen)
        }}
      >
        <div data-localization-button-text>
          <span data-localization-button-text-locale>{localeText}</span>
          <span data-localization-button-text-separator>/</span>
          <span data-localization-button-text-currency>{currencyText}</span>
        </div>
        <Icon
          data-localization-button-arrow
          name="CaretDown"
          width={16}
          height={16}
          aria-label={ariaLabel}
        />
      </UIButton>

      {isSelectorOpen && (
        <LocalizationSelector
          isOpen={isSelectorOpen}
          onClose={() => {
            setIsSelectorOpen(false)
            reset()
          }}
          triggerRef={buttonRef}
          languages={languages}
          currencies={currencies}
          localeCode={localeCode}
          currencyCode={currencyCode}
          onLocaleChange={setLocaleCode}
          onCurrencyChange={setCurrencyCode}
          onSave={save}
          isSaveEnabled={isSaveEnabled}
          error={error}
          title={title}
          languageLabel={languageLabel}
          currencyLabel={currencyLabel}
          description={description}
          saveLabel={saveLabel}
          errorMessages={errorMessages}
          popoverPlacement={popoverPlacement}
        />
      )}
    </>
  )
}

export default LocalizationButton
