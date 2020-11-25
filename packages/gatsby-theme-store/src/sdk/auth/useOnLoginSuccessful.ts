import { localizedPath, useIntl } from '@vtex/gatsby-plugin-i18n'
import { navigate } from 'gatsby'
import { useCallback } from 'react'

import { useSession } from '../session/useSession'

export const useOnLoginSuccessful = () => {
  const { defaultLocale, locale } = useIntl()
  const [, dispatch] = useSession()

  return useCallback(
    async (returnUrl = '/account') => {
      // After successfull login, create a new session
      await dispatch({ type: 'create' })

      const path = localizedPath(defaultLocale, locale, returnUrl)

      navigate(path)
    },
    [defaultLocale, dispatch, locale]
  )
}
