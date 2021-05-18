import { useIntl } from 'react-intl'
import { useMemo } from 'react'

import { localizedPath } from './path'

export const useLocalizedPath = (path: string) => {
  const { defaultLocale, locale } = useIntl()

  return useMemo(() => localizedPath(defaultLocale, locale, path), [
    defaultLocale,
    locale,
    path,
  ])
}
