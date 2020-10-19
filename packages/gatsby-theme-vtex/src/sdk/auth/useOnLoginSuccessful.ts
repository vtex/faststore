import { localizedPath, useIntl } from '@vtex/gatsby-plugin-i18n'
import { navigate } from 'gatsby'
import { useCallback } from 'react'

export const useOnLoginSuccessful = () => {
  const { defaultLocale, locale } = useIntl()

  return useCallback(
    (returnUrl = '/') => {
      const path = localizedPath(defaultLocale, locale, returnUrl)

      navigate(path)
    },
    [defaultLocale, locale]
  )
}
