import { useIntl } from 'react-intl'
import { useLocaleContext } from './MyAccountIntlProvider'

const SUPPORTED_LOCALES = [
  { value: 'en-US', messageId: 'myaccount.locale.enUS' },
  { value: 'pt-BR', messageId: 'myaccount.locale.ptBR' },
]

export function LocaleSelector() {
  const { locale, setLocale } = useLocaleContext()
  const intl = useIntl()

  return (
    <select
      data-fs-locale-selector
      value={locale}
      aria-label={intl.formatMessage({ id: 'myaccount.locale.label' })}
      onChange={(e) => setLocale(e.target.value)}
    >
      {SUPPORTED_LOCALES.map(({ value, messageId }) => (
        <option key={value} value={value}>
          {intl.formatMessage({ id: messageId })}
        </option>
      ))}
    </select>
  )
}
