import { useRef, useState } from 'react'

import { Icon, Button as UIButton } from '@faststore/ui'

import LocalizationSelector from 'src/components/localization/LocalizationSelector'
import { useBindingSelector } from 'src/sdk/localization'

interface LocalizationButtonProps {
  icon: string
  title?: string
  languageLabel?: string
  currencyLabel?: string
  description?: string
  saveLabel?: string
}

const LocalizationButton = ({
  icon,
  title,
  languageLabel,
  currencyLabel,
  description,
  saveLabel,
}: LocalizationButtonProps) => {
  const [isSelectorOpen, setIsSelectorOpen] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)

  const {
    languages,
    currencies,
    localeCode,
    currencyCode,
    setLocaleCode,
    setCurrencyCode,
    save,
    canSave,
    error,
  } = useBindingSelector()

  // Extract language code from locale code for display (e.g., "pt-BR" -> "PT")
  const localeText = localeCode?.split('-')[0].toUpperCase() ?? ''
  const currencyText = currencyCode ?? ''

  return (
    <>
      <UIButton
        ref={buttonRef}
        data-fs-localization-button
        icon={<Icon name={icon} width={16} height={16} weight="bold" />}
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
          aria-hidden="true"
          width={16}
          height={16}
          aria-label="Open localization modal"
        />
      </UIButton>

      {isSelectorOpen && (
        <LocalizationSelector
          isOpen={isSelectorOpen}
          onClose={() => setIsSelectorOpen(false)}
          triggerRef={buttonRef}
          languages={languages}
          currencies={currencies}
          localeCode={localeCode}
          currencyCode={currencyCode}
          onLocaleChange={setLocaleCode}
          onCurrencyChange={setCurrencyCode}
          onSave={save}
          canSave={canSave}
          error={error}
          title={title}
          languageLabel={languageLabel}
          currencyLabel={currencyLabel}
          description={description}
          saveLabel={saveLabel}
        />
      )}
    </>
  )
}

export default LocalizationButton
