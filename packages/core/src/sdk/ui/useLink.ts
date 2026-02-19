import storeConfig from 'discovery.config'
import { useRouter } from 'next/router'
import { useCallback } from 'react'
import {
  addCustomPathPrefix,
  extractCustomPathPrefix,
} from 'src/utils/localization/customPaths'

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
        const asPath = router.asPath ?? ''
        const withCustomPath = addCustomPathPrefix(href, asPath)
        const defaultLocale = storeConfig.localization?.defaultLocale
        // Check if current page has a custom path prefix
        const onCustomPath = extractCustomPathPrefix(asPath) !== null
        // Only add Next.js locale when no custom path was applied AND we're not on a custom-path page
        if (
          router.locale &&
          defaultLocale &&
          router.locale !== defaultLocale &&
          !onCustomPath
        ) {
          return `/${router.locale}${href}`
        }
        return withCustomPath
      }
      return href
    },
    [router.asPath, router.locale]
  )

  return { resolveLink }
}
