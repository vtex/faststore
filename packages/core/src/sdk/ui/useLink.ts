import { useCallback } from 'react'
import { useRouter } from 'next/router'
import { addCustomPathPrefix } from 'src/utils/localization/customPaths'

/**
 * Hook that centralizes link resolution with custom path prefix (i18n).
 * Use resolveLink(href) to get the href with the current locale's custom path applied when applicable.
 */
export function useLink() {
  const router = useRouter()

  const resolveLink = useCallback(
    (href: string | undefined): string | undefined => {
      if (href == null || href === '') {
        return undefined
      }
      if (href.startsWith('/') && !href.startsWith('//')) {
        return addCustomPathPrefix(href, router.asPath ?? '')
      }
      return href
    },
    [router.asPath]
  )

  return { resolveLink }
}
