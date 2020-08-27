import { useIntl } from '@vtex/gatsby-plugin-i18n'

export const useLocale = () => {
  const { locale } = useIntl()

  return locale
}
