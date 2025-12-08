import { Icon, Button as UIButton } from '@faststore/ui'

import { useSession } from 'src/sdk/session'

const I18nButton = ({ icon }: { icon: string }) => {
  const { locale, currency } = useSession()

  const localeText = locale.split('-')[0].toUpperCase()

  return (
    <UIButton
      icon={<Icon name={icon} width={18} height={18} weight="bold" />}
      iconPosition="left"
      variant="tertiary"
      data-fs-i18n-button
      onClick={() => {
        // TODO: Open the i18nModal to set region/locale/currency/language
        console.log('I18nButton clicked')
      }}
    >
      <div data-i18n-button-text>
        <span data-i18n-button-text-locale>{localeText}</span>
        <span data-i18n-button-text-separator>/</span>
        <span data-i18n-button-text-currency>{currency.code}</span>
      </div>
      <Icon data-i18n-button-arrow name="CaretDown" width={12} height={12} />
    </UIButton>
  )
}

export default I18nButton
