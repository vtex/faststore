import { useRef, useState } from 'react'

import { Icon, Button as UIButton } from '@faststore/ui'

import I18nSelector from 'src/components/i18n/I18nSelector'
import { useBindingSelector } from 'src/sdk/i18n'

interface I18nButtonProps {
  icon: string
  title?: string
  languageLabel?: string
  currencyLabel?: string
  description?: string
  saveLabel?: string
}

const I18nButton = ({
  icon,
  title,
  languageLabel,
  currencyLabel,
  description,
  saveLabel,
}: I18nButtonProps) => {
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
        data-fs-i18n-button
        icon={<Icon name={icon} width={16} height={16} weight="bold" />}
        iconPosition="left"
        variant="tertiary"
        onClick={() => {
          setIsSelectorOpen(!isSelectorOpen)
        }}
      >
        <div data-i18n-button-text>
          <span data-i18n-button-text-locale>{localeText}</span>
          <span data-i18n-button-text-separator>/</span>
          <span data-i18n-button-text-currency>{currencyText}</span>
        </div>
        <Icon
          data-i18n-button-arrow
          name="CaretDown"
          aria-hidden="true"
          width={16}
          height={16}
          aria-label="Open i18n modal"
        />
      </UIButton>

      {isSelectorOpen && (
        <I18nSelector
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

export default I18nButton
