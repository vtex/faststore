import { useRouter } from 'next/router'
import { useEffect } from 'react'

import storeConfig from 'discovery.config'
import { validateLocaleForHostname } from 'src/utils/validateLocaleForHostname'

/**
 * Client-side validation hook for locale binding.
 *
 * This hook validates that the current locale matches the hostname binding
 * configuration. It acts as a fallback for static pages that cannot perform
 * server-side validation.
 *
 * If the locale is invalid for the current hostname, the user is redirected to the 404 page.
 *
 * Only runs if multilanguage feature is enabled (multilanguage.enabled === true).
 */
export function useLocaleValidation() {
  const router = useRouter()

  useEffect(() => {
    // Skip validation if multilanguage feature is not enabled
    if (!storeConfig.multilanguage?.enabled) {
      return
    }

    // Skip validation if we're already on the 404 page (from SSR notFound)
    if (router.pathname === '/404') {
      return
    }

    const hostname = window.location.hostname
    const locale = router.locale

    if (!locale) {
      return
    }

    try {
      const isValid = validateLocaleForHostname(hostname, locale)

      if (!isValid) {
        window.location.href = `/404?from=${encodeURIComponent(`/${locale}${router.asPath}`)}`
      }
    } catch (error) {
      console.warn('Client-side locale validation failed:', error)
    }
  }, [router.locale, router.asPath, router.defaultLocale, router.pathname])
}
