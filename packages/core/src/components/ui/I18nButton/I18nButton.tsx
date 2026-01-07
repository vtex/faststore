import { useRef, useState } from 'react'

import { Icon, Button as UIButton } from '@faststore/ui'

import I18nSelector from 'src/components/i18n/I18nSelector'
import { useSession } from 'src/sdk/session'

const MOCK_LANGUAGES: Record<string, string> = {
  'pt-BR': 'Português',
  'en-US': 'Inglês',
  'it-IT': 'Italiano',
}

const MOCK_CURRENCIES: Record<string, string> = {
  BRL: 'BRL',
  USD: 'USD',
  EUR: 'EUR',
}

const I18nButton = ({ icon }: { icon: string }) => {
  const { locale, currency } = useSession()
  const [isSelectorOpen, setIsSelectorOpen] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)

  const localeText = locale.split('-')[0].toUpperCase()

  const defaultLanguage =
    locale && MOCK_LANGUAGES[locale] ? locale : Object.keys(MOCK_LANGUAGES)[0]
  const defaultCurrency =
    currency?.code && MOCK_CURRENCIES[currency.code]
      ? currency.code
      : Object.keys(MOCK_CURRENCIES)[0]

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
          <span data-i18n-button-text-currency>{currency.code}</span>
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
          languages={MOCK_LANGUAGES}
          currencies={MOCK_CURRENCIES}
          title="Selecione lingua e moeda"
          languageLabel="Lingua"
          currencyLabel="Moeda"
          description="Alterar o idioma ou a moeda pode afetar preços, promoções e disponibilidade."
          saveLabel="Salvar"
          defaultLanguage={defaultLanguage}
          defaultCurrency={defaultCurrency}
        />
      )}
    </>
  )
}

export default I18nButton
