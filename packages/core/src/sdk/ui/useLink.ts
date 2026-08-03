import storeConfig from 'discovery.config'
import { useRouter } from 'next/router'
import { useCallback } from 'react'
import {
  addCustomPathPrefix,
  extractCustomPathPrefix,
} from 'src/utils/localization/bindingPaths'

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
        // On a subdomain, router.defaultLocale is set to the domain's locale (e.g., fr-FR).
        // Using the global config default (e.g., en-US) would incorrectly prepend /fr-FR/ to every link, breaking navigation.
        const defaultLocale =
          router.defaultLocale ?? storeConfig.localization?.defaultLocale
        // Check if current page has a custom path prefix
        const onCustomPath = extractCustomPathPrefix(asPath) !== null
        // Only add Next.js locale when no custom path was applied AND we're not on a custom-path page
        if (
          storeConfig.localization?.enabled &&
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
