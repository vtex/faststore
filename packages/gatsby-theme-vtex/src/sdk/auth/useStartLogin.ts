import { localizedPath, useIntl } from '@vtex/gatsby-plugin-i18n'
import { useCallback } from 'react'

import { startLogin } from './Service/startLogin'

type Options = Omit<ArrayItem<Parameters<typeof startLogin>>, 'returnUrl'>

export const useStartLogin = () => {
  const { defaultLocale, locale } = useIntl()

  return useCallback(
    (options: Options) => {
      const path = localizedPath(defaultLocale, locale, '/account')
      const returnUrl = `${window.origin}${path}`

      return startLogin({ ...options, returnUrl })
    },
    [defaultLocale, locale]
  )
}
